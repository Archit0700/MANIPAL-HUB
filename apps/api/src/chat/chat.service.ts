import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service';
import { ChatRequestDto } from './dto/chat-request.dto';
import { ChatCitationDto, ChatResponseDto } from './dto/chat-response.dto';

type ChunkMatch = {
  id: string;
  content: string;
  metadata: Prisma.JsonValue | null;
  docId: string | null;
  docTitle: string | null;
  docSource: string | null;
  distance: number;
};

@Injectable()
export class ChatService {
  private static readonly CONTACT_NUMBER = '+91 7976958639';
  private static readonly CONTACT_TEL_URI = '+917976958639';

  private readonly openai?: OpenAI;
  private readonly embeddingModel: string;
  private readonly chatModel: string;
  private readonly systemPrompt: string;
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    const apiKey = this.config.get<string>('OPENAI_API_KEY');
    const baseURL = this.config.get<string>('OPENAI_BASE_URL');

    this.embeddingModel =
      this.config.get<string>('OPENAI_EMBEDDING_MODEL') ?? 'text-embedding-3-small';
    this.chatModel = this.config.get<string>('OPENAI_CHAT_MODEL') ?? 'gpt-4o-mini';
    this.systemPrompt =
      this.config.get<string>('CHAT_SYSTEM_PROMPT') ??
      'You are MANIPAL HUB, a helpful guide for students at Manipal University Jaipur. Use only the supplied context to answer questions.';

    if (apiKey) {
      this.openai = new OpenAI({ apiKey, baseURL });
    }
  }

  async respond(request: ChatRequestDto): Promise<ChatResponseDto> {
    if (!request.message?.trim()) {
      throw new BadRequestException('message is required');
    }

    if (!this.openai) {
      return this.respondWithoutOpenAI(request.message, request.limit ?? 5);
    }

    try {
      const openai = this.ensureOpenAI();
      const embedding = await this.createEmbedding(openai, request.message);
      const matches = await this.searchSimilarChunks(embedding, request.limit ?? 5);
      const answer = this.appendContactNumber(
        await this.generateAnswer(openai, request.message, matches),
      );

      const citations: ChatCitationDto[] = matches.map((match) => ({
        id: match.id,
        content: match.content,
        source: match.docSource ?? match.docTitle ?? null,
        distance: match.distance,
      }));

      return {
        answer,
        citations,
      };
    } catch (error) {
      if (this.isOpenAIRateLimited(error)) {
        this.logger.warn('OpenAI quota exceeded, falling back to keyword-based response.');
        return this.respondWithoutOpenAI(request.message, request.limit ?? 5);
      }

      throw error;
    }
  }

  private async respondWithoutOpenAI(message: string, limit: number): Promise<ChatResponseDto> {
    const normalizedLimit = Math.min(Math.max(limit, 1), 5);
    const keywords = message
      .toLowerCase()
      .split(/\W+/)
      .filter((word) => word.length >= 3)
      .slice(0, 5);

    const chunks = await this.prisma.chunk.findMany({
      where:
        keywords.length > 0
          ? {
              AND: keywords.map((word) => ({
                content: {
                  contains: word,
                  mode: Prisma.QueryMode.insensitive,
                },
              })),
            }
          : undefined,
      include: {
        doc: true,
        article: true,
      },
      take: normalizedLimit,
    });

    if (chunks.length === 0) {
      return {
        answer: this.appendContactNumber(
          "I'm sorry, I couldn't find details about that yet. Please contact the Manipal University Jaipur helpdesk for more information.",
        ),
        citations: [],
      };
    }

    const leading = chunks[0];
    const sourceLabel = leading.doc?.source ?? leading.doc?.title ?? leading.article?.title ?? 'MUJ resource';

    return {
      answer: this.appendContactNumber(
        `Here is what I found in ${sourceLabel}:\n\n${leading.content}`,
      ),
      citations: chunks.map((chunk) => ({
        id: chunk.id,
        content: chunk.content,
        source: chunk.doc?.source ?? chunk.doc?.title ?? chunk.article?.title ?? null,
        distance: 0,
      })),
    };
  }

  private isOpenAIRateLimited(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
      return false;
    }

    const maybeStatus = (error as { status?: number; code?: number | string }).status;
    if (maybeStatus === 429) {
      return true;
    }

    const code = (error as { code?: number | string }).code;
    if (code === 429 || code === 'insufficient_quota') {
      return true;
    }

    const inner = (error as { error?: { type?: string; code?: string } }).error;
    if (inner?.type === 'insufficient_quota' || inner?.type === 'rate_limit_exceeded' || inner?.code === 'insufficient_quota') {
      return true;
    }

    const message = (error as { message?: string }).message;
    return typeof message === 'string' && message.toLowerCase().includes('quota');
  }

  private appendContactNumber(answer: string): string {
    const trimmed = answer?.trim() ?? '';
    if (trimmed.includes(ChatService.CONTACT_NUMBER)) {
      return trimmed;
    }

    return `${trimmed}\n\nFor immediate assistance, call ${ChatService.CONTACT_NUMBER}.`;
  }

  private ensureOpenAI(): OpenAI {
    if (!this.openai) {
      throw new BadRequestException('OPENAI_API_KEY is not configured');
    }
    return this.openai;
  }

  private async createEmbedding(client: OpenAI, text: string): Promise<number[]> {
    const response = await client.embeddings.create({
      model: this.embeddingModel,
      input: text,
    });

    const embedding = response.data[0]?.embedding;
    if (!embedding) {
      this.logger.error('OpenAI returned an empty embedding response.');
      throw new BadRequestException('Unable to generate embedding for message');
    }

    return embedding;
  }

  private async searchSimilarChunks(
    embedding: number[],
    limit: number,
  ): Promise<ChunkMatch[]> {
    const cappedLimit = Math.min(Math.max(limit, 1), 10);
    const vector = `[${embedding.join(',')}]`;

    const rows = await this.prisma.$queryRaw<ChunkMatch[]>`
      SELECT
        c.id,
        c.content,
        c.metadata,
        c."docId",
        d.title as "docTitle",
        d.source as "docSource",
        c.embedding <-> ${vector}::vector as distance
      FROM "Chunk" c
      LEFT JOIN "Doc" d ON d.id = c."docId"
      ORDER BY distance ASC
      LIMIT ${cappedLimit};
    `;

    return rows;
  }

  private async generateAnswer(
    client: OpenAI,
    question: string,
    context: ChunkMatch[],
  ): Promise<string> {
    const contextText =
      context.length > 0
        ? context
            .map(
              (chunk, index) =>
                `Source ${index + 1} (distance: ${chunk.distance.toFixed(4)}): ${chunk.content}`,
            )
            .join('\n\n')
        : 'No relevant context found.';

    const completion = await client.chat.completions.create({
      model: this.chatModel,
      temperature: 0.2,
      messages: [
        { role: 'system', content: this.systemPrompt },
        {
          role: 'user',
          content: `Context:\n${contextText}\n\nQuestion: ${question}`,
        },
      ],
    });

    return completion.choices[0]?.message?.content?.trim() ?? '';
  }
}

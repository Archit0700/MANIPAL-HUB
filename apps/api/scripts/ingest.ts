import 'dotenv/config';
import { Prisma, PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import { randomUUID } from 'node:crypto';
import { docSources } from '../prisma/seed-data';

const prisma = new PrismaClient();

const embeddingModel =
  process.env.OPENAI_EMBEDDING_MODEL ?? 'text-embedding-3-small';
const throttleMs = Number(process.env.RAG_RATE_LIMIT_MS ?? '200');

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }
  const baseURL = process.env.OPENAI_BASE_URL;
  return new OpenAI({ apiKey, baseURL });
}

function chunkText(text: string, chunkSize = 800, overlap = 120): string[] {
  const sanitized = text.replace(/\s+/g, ' ').trim();
  if (sanitized.length <= chunkSize) {
    return [sanitized];
  }

  const chunks: string[] = [];
  let start = 0;
  while (start < sanitized.length) {
    const end = Math.min(start + chunkSize, sanitized.length);
    chunks.push(sanitized.slice(start, end));
    if (end === sanitized.length) {
      break;
    }
    start = end - overlap;
    if (start < 0) {
      start = 0;
    }
  }
  return chunks;
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function ingest() {
  const client = getClient();

  for (const doc of docSources) {
    const storedDoc = await prisma.doc.upsert({
      where: { id: doc.id },
      update: { title: doc.title, source: doc.source },
      create: { id: doc.id, title: doc.title, source: doc.source },
    });

    await prisma.$executeRaw`
      DELETE FROM "Chunk" WHERE "docId" = ${storedDoc.id};
    `;

    const chunks = chunkText(doc.content);
    for (const chunk of chunks) {
      const embeddingResponse = await client.embeddings.create({
        model: embeddingModel,
        input: chunk,
      });

      const embeddingVector = embeddingResponse.data[0]?.embedding;
      if (!embeddingVector) {
        throw new Error('Failed to generate embedding for chunk.');
      }

      const chunkId = randomUUID();
      const metadata = {
        title: doc.title,
        source: doc.source,
      };

      const vectorLiteral = Prisma.sql`ARRAY[${Prisma.join(
        embeddingVector.map((value) => Prisma.sql`${value}`),
      )}]::vector`;

      await prisma.$executeRaw(
        Prisma.sql`
          INSERT INTO "Chunk" ("id", "docId", content, "metadata", "createdAt", embedding)
          VALUES (
            ${chunkId},
            ${storedDoc.id},
            ${chunk},
            ${JSON.stringify(metadata)}::jsonb,
            NOW(),
            ${vectorLiteral}
          );
        `,
      );

      if (throttleMs > 0) {
        await sleep(throttleMs);
      }
    }
  }
}

ingest()
  .then(() => {
    console.info('Vector ingest completed successfully.');
  })
  .catch((error) => {
    console.error('Vector ingest failed.', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

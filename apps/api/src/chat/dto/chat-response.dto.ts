export class ChatCitationDto {
  id!: string;
  content!: string;
  source?: string | null;
  distance!: number;
}

export class ChatResponseDto {
  answer!: string;
  citations!: ChatCitationDto[];
}

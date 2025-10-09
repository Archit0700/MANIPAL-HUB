import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class ChatRequestDto {
  @IsString()
  @MaxLength(2000)
  message!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  limit?: number;
}

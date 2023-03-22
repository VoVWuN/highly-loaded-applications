import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString({ message: 'Поле message должно быть строкой' })
  @IsNotEmpty()
  message: string;

  @IsNumber()
  @IsOptional()
  commentId: number;

  @IsNumber()
  @IsOptional()
  newsId: number;

  @IsNumber()
  @IsOptional()
  userId: number;
}
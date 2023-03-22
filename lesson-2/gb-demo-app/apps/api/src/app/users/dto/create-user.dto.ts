import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

// export enum Role {
//   User = 'user',
//   Admin = 'admin',
//   Moderator = 'moderator',
// }

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  avatar: string;
}
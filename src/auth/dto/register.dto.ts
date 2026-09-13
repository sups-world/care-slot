// src/auth/dto/register.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';
import {Transform} from 'class-transformer'

export class RegisterDto {
  @IsEmail()
  @Transform(({ value }) => String(value).trim().toLowerCase())
  email: string;

  @IsString()
  @MinLength(6)
  @Transform(({ value }) => String(value))
  password: string;
}
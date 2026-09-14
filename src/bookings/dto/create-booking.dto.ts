// src/bookings/dto/create-booking.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'clx1234567890' })
  @IsNotEmpty()
  @IsString()
  slotId: string;
}
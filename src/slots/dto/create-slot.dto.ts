// src/slots/dto/create-slot.dto.ts
import { IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSlotDto {
  @ApiProperty({
    example: '2026-09-20T10:00:00.000Z',
    description: 'Start time in ISO format (UTC recommended)',
  })
  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @ApiProperty({
    example: '2026-09-20T11:00:00.000Z',
    description: 'End time in ISO format (UTC recommended)',
  })
  @IsNotEmpty()
  @IsDateString()
  endTime: string;
}
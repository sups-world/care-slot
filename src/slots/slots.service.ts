// src/slots/slots.service.ts
import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSlotDto } from './dto/create-slot.dto.js';

@Injectable()
export class SlotsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(providerId: string, dto: CreateSlotDto) {
    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);
    const now = new Date();

    // Validation rules required by the assignment
    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    if (startTime <= now) {
      throw new BadRequestException('Cannot create slots in the past');
    }

    return this.prisma.slot.create({
      data: {
        providerId,
        startTime,
        endTime,
      },
    });
  }
}
// src/bookings/bookings.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { BookingStatus } from '../generated/prisma/enums.js';


@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(clientId: string, dto: CreateBookingDto) {
    try {
      // Transaction + unique constraint on slotId = concurrency safe
      return await this.prisma.$transaction(async (tx) => {
        const slot = await tx.slot.findUnique({
          where: { id: dto.slotId },
          include: { booking: true },
        });

        if (!slot) {
          throw new NotFoundException('Slot not found');
        }

        if (slot.booking) {
          throw new ConflictException('Slot is already booked');
        }

        if (slot.startTime <= new Date()) {
          throw new BadRequestException('Cannot book a past slot');
        }

        return tx.booking.create({
          data: {
            slotId: dto.slotId,
            clientId,
            status: BookingStatus.ACTIVE,
          },
          include: {
            slot: true,
          },
        });
      });
    } catch (error: any) {
      // Catch unique constraint violation (race condition)
      if (error.code === 'P2002') {
        throw new ConflictException('Slot is already booked');
      }
      throw error;
    }
  }

  async findMyBookings(clientId: string) {
    return this.prisma.booking.findMany({
      where: { clientId },
      include: {
        slot: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            providerId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async cancel(bookingId: string, clientId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.clientId !== clientId) {
      throw new ForbiddenException('You can only cancel your own bookings');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CANCELLED },
      include: { slot: true },
    });
  }
}
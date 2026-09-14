// src/bookings/bookings.controller.ts
import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';


import { BookingsService } from './bookings.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';

import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Roles } from '../common/decorators/roles.decorators.js';
import { Role } from '../generated/prisma/enums.js';

@ApiTags('Bookings')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Roles(Role.CLIENT)
  @ApiOperation({ summary: 'Client books an available slot' })
  @ApiResponse({ status: 201, description: 'Booking created' })
  @ApiResponse({ status: 409, description: 'Slot already booked' })
  create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateBookingDto,
  ) {
    return this.bookingsService.create(user.id, dto);
  }

  @Get('me')
  @Roles(Role.CLIENT)
  @ApiOperation({ summary: 'Client lists own bookings' })
  findMyBookings(@CurrentUser() user: { id: string }) {
    return this.bookingsService.findMyBookings(user.id);
  }

  @Patch(':id/cancel')
  @Roles(Role.CLIENT)
  @ApiOperation({ summary: 'Client cancels own booking' })
  @ApiResponse({ status: 200, description: 'Booking cancelled' })
  @ApiResponse({ status: 403, description: 'Not your booking' })
  cancel(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.bookingsService.cancel(id, user.id);
  }
}
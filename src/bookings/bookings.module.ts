// src/bookings/bookings.module.ts
import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller.js';
import { BookingsService } from './bookings.service.js';
import { PassportModule } from '@nestjs/passport';

@Module({
      imports: [
      PassportModule.register({
        defaultStrategy: 'jwt'
      })
    ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
// src/slots/slots.module.ts
import {  Module } from '@nestjs/common';
import {SlotsController } from './slots.controller.js';
import {SlotsService } from './slots.service.js';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
    PassportModule.register({
      defaultStrategy: 'jwt'
    })
  ],
  controllers: [SlotsController],
  providers: [SlotsService],
  exports: [SlotsService],
})
export class SlotsModule {}
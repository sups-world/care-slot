// src/slots/slots.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';


import {SlotsService } from './slots.service.js';
import { CreateSlotDto } from './dto/create-slot.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';

import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Roles } from '../common/decorators/roles.decorators.js';
import { Role } from '../generated/prisma/enums.js';

@ApiTags('Slots')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('providers')
export class SlotsController {
  constructor(private readonly slotsService:SlotsService) {}

  @Post('/me/slots')
  @Roles(Role.PROVIDER)
  @ApiOperation({ summary: 'Provider creates an availability slot' })
  @ApiResponse({ status: 201, description: 'Slot created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed (past time / start >= end)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - only PROVIDER can access' })
  create(
    @CurrentUser() user: { id: string; role: Role },
    @Body() dto: CreateSlotDto,
  ) {
    return this.slotsService.create(user.id, dto);
  }

  // Client lists available slots of a provider
  @Get('/:id/slots')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT)
  @ApiOperation({ summary: 'Client lists available slots of a provider' })
  @ApiQuery({ name: 'from', required: false, example: '2026-09-20T00:00:00.000Z' })
  @ApiQuery({ name: 'to', required: false, example: '2026-09-25T23:59:59.000Z' })
  findAvailable(
    @Param('id') providerId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.slotsService.findAvailableByProvider(providerId, from, to);
  }
}
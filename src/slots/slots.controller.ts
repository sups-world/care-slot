// src/slots/slots.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
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
@Controller('providers/me/slots')
export class SlotsController {
  constructor(private readonly slotsService:SlotsService) {}

  @Post()
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
}
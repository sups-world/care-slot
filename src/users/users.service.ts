// src/users/users.service.ts
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { Role, User } from '../generated/prisma/client.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async createClient(email: string, hashedPassword: string): Promise<User> {
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: Role.CLIENT, // force CLIENT — never allow PROVIDER via registration
      },
    });
  }
}

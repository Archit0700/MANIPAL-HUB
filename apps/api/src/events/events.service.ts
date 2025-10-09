import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.event.findMany({
      orderBy: { startAt: 'asc' },
    });
  }
}

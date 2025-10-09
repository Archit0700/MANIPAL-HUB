import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FaqsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.faq.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }
}

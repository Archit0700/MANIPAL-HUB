import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PoisService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.poi.findMany({
      orderBy: { name: 'asc' },
    });
  }
}

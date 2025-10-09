import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.doc.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}

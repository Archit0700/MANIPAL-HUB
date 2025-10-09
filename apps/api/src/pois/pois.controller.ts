import { Controller, Get } from '@nestjs/common';
import { PoisService } from './pois.service';

@Controller('pois')
export class PoisController {
  constructor(private readonly poisService: PoisService) {}

  @Get()
  findAll() {
    return this.poisService.findAll();
  }
}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './articles/articles.module';
import { ChatModule } from './chat/chat.module';
import { DocsModule } from './docs/docs.module';
import { EventsModule } from './events/events.module';
import { FaqsModule } from './faqs/faqs.module';
import { PoisModule } from './pois/pois.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ArticlesModule,
    FaqsModule,
    PoisModule,
    EventsModule,
    DocsModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

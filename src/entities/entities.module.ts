import { Module } from '@nestjs/common';
import { EntitiesService } from './entities.service';
import { EntitiesController } from './entities.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [EntitiesService, PrismaService],
  controllers: [EntitiesController],
  exports: [EntitiesService],
})
export class EntitiesModule {}
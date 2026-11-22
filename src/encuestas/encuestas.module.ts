import { Module } from '@nestjs/common';
import { EncuestasService } from './encuestas.service';
import { EncuestasController } from './encuestas.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [EncuestasService, PrismaService],
  controllers: [EncuestasController],
})
export class EncuestasModule {}
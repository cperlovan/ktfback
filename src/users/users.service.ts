import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, data: { name?: string; role?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async getUserRespuestas(userId: string) {
    return this.prisma.respuestaEncuesta.findMany({
      where: { userId },
      include: {
        encuesta: {
          select: { id: true, nombreEntidad: true, tipoEntidad: true }
        }
      }
    });
  }

  async crearRespuestaEncuesta(data: {
    userId: string;
    encuestaId: string;
    preguntaId?: string;
    respuesta: string;
    tipoRespuesta: string;
  }) {
    return this.prisma.respuestaEncuesta.create({
      data: {
        userId: data.userId,
        encuestaId: data.encuestaId,
        preguntaId: data.preguntaId,
        respuesta: data.respuesta,
        tipoRespuesta: data.tipoRespuesta
      }
    });
  }

  

}
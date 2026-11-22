import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Encuesta, Pregunta } from '@prisma/client';

@Injectable()
export class EncuestasService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.encuesta.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async create(nombreEntidad: string, tipoEntidad: 'PRODUCTO' | 'LOCAL' | 'PERSONA' | 'OTRO', descripcion: string, userId: string) {
    return this.prisma.encuesta.create({
      data: {
        nombreEntidad,
        tipoEntidad,
        descripcion,
        user: {
          connect: {
            id: userId,
          },
        },
        activo: true,
        preguntas: {
          create: [],
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.encuesta.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        preguntas: true,
      },
    });
  }

  async update(id: string, datos: { nombreEntidad?: string; tipoEntidad?: string; descripcion?: string; activo?: boolean; preguntas?: { crear?: any[]; actualizar?: any[]; eliminar?: any[] } }) {
    const { preguntas, ...datosSinPreguntas } = datos;
    
    // Extraer el .map() a una variable para evitar error de parsing TS1005
    const updates = preguntas.actualizar ? preguntas.actualizar.map((p: any) => ({ where: { id: p.id }, data: { texto: p.texto, tipo: p.tipo, obligatoria: p.obligatoria, opciones: p.opciones } })) : [];

    return this.prisma.encuesta.update({
      where: { id },
      data: {
        ...datosSinPreguntas,
        ...(preguntas && {
          preguntas: {
            create: preguntas.crear || [],
            update: updates,
            delete: preguntas.eliminar || [],
          }
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        preguntas: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.encuesta.delete({
      where: { id },
    });
  }
}

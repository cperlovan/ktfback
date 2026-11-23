import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EncuestasService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.encuesta.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        preguntas: true,
        _count: {
          select: { respuestas: true },
        },
      },
    });
  }

  async create(
    nombreEntidad: string,
    tipoEntidad: 'PRODUCTO' | 'LOCAL' | 'PERSONA' | 'OTRO',
    descripcion: string | undefined,
    userId: string,
    preguntasInput: Array<{
      texto: string;
      tipo: 'ESTRELLAS' | 'TEXTO' | 'MULTIPLE';
      obligatoria?: boolean;
      opciones?: string[] | string | null;
    }> = [],
  ) {
    const preguntasData = preguntasInput.map((p) => {
      let opcionesSerializadas: string | null = null;
      if (p.tipo === 'MULTIPLE') {
        if (Array.isArray(p.opciones)) {
          opcionesSerializadas = JSON.stringify(p.opciones);
        } else if (typeof p.opciones === 'string') {
          opcionesSerializadas = p.opciones;
        } else {
          opcionesSerializadas = JSON.stringify([]);
        }
      }

      return {
        texto: p.texto,
        tipo: p.tipo,
        obligatoria: p.obligatoria ?? true,
        opciones: opcionesSerializadas,
      };
    });

    return this.prisma.encuesta.create({
      data: {
        nombreEntidad,
        tipoEntidad,
        descripcion: descripcion ?? null,
        activo: true,
        user: {
          connect: { id: userId },
        },
        preguntas: {
          create: preguntasData,
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
        preguntas: true,
        _count: {
          select: { respuestas: true },
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
        _count: {
          select: { respuestas: true },
        },
      },
    });
  }

  async update(
    id: string,
    datos: {
      nombreEntidad?: string;
      tipoEntidad?: 'PRODUCTO' | 'LOCAL' | 'PERSONA' | 'OTRO';
      descripcion?: string | null;
      activo?: boolean;
      preguntas?: Array<{
        id?: string;
        texto: string;
        tipo: 'ESTRELLAS' | 'TEXTO' | 'MULTIPLE';
        obligatoria?: boolean;
        opciones?: string[] | string | null;
      }>;
    },
  ) {
    const { preguntas, ...datosSinPreguntas } = datos;

    const serializarOpciones = (
      tipo: 'ESTRELLAS' | 'TEXTO' | 'MULTIPLE',
      opciones?: string[] | string | null,
    ): string | null => {
      if (tipo !== 'MULTIPLE') return null;
      if (Array.isArray(opciones)) {
        return JSON.stringify(opciones.map((o) => o.trim()).filter(Boolean));
      }
      if (typeof opciones === 'string') return opciones;
      return JSON.stringify([]);
    };

    return this.prisma.$transaction(async (tx) => {
      if (Array.isArray(preguntas)) {
        const existentes = await tx.pregunta.findMany({
          where: { encuestaId: id },
          select: { id: true },
        });
        const idsExistentes = existentes.map((p) => p.id);
        const idsEnviados = preguntas
          .map((p) => p.id)
          .filter((pid): pid is string => Boolean(pid) && idsExistentes.includes(pid!));

        const idsAEliminar = idsExistentes.filter((oldId) => !idsEnviados.includes(oldId));
        if (idsAEliminar.length > 0) {
          await tx.pregunta.deleteMany({
            where: { id: { in: idsAEliminar }, encuestaId: id },
          });
        }

        for (const p of preguntas) {
          const opcionesSerializadas = serializarOpciones(p.tipo, p.opciones);
          if (p.id && idsExistentes.includes(p.id)) {
            await tx.pregunta.update({
              where: { id: p.id },
              data: {
                texto: p.texto.trim(),
                tipo: p.tipo,
                obligatoria: p.obligatoria ?? true,
                opciones: opcionesSerializadas,
              },
            });
          } else {
            await tx.pregunta.create({
              data: {
                encuestaId: id,
                texto: p.texto.trim(),
                tipo: p.tipo,
                obligatoria: p.obligatoria ?? true,
                opciones: opcionesSerializadas,
              },
            });
          }
        }
      }

      return tx.encuesta.update({
        where: { id },
        data: {
          ...(datosSinPreguntas.nombreEntidad !== undefined && {
            nombreEntidad: datosSinPreguntas.nombreEntidad.trim(),
          }),
          ...(datosSinPreguntas.tipoEntidad !== undefined && {
            tipoEntidad: datosSinPreguntas.tipoEntidad,
          }),
          ...(datosSinPreguntas.descripcion !== undefined && {
            descripcion: datosSinPreguntas.descripcion?.trim() || null,
          }),
          ...(datosSinPreguntas.activo !== undefined && {
            activo: datosSinPreguntas.activo,
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
          _count: {
            select: { respuestas: true },
          },
        },
      });
    });
  }

  async remove(id: string) {
    return this.prisma.encuesta.delete({
      where: { id },
    });
  }
}
import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        email: string;
        name: string;
        id: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        email: string;
        name: string;
        id: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: {
        name?: string;
        role?: string;
    }): Promise<{
        email: string;
        name: string;
        id: string;
        role: string;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        email: string;
        password: string;
        name: string | null;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getUserRespuestas(userId: string): Promise<({
        encuesta: {
            id: string;
            nombreEntidad: string;
            tipoEntidad: string;
        };
    } & {
        id: string;
        userId: string;
        encuestaId: string;
        preguntaId: string | null;
        respuesta: string;
        tipoRespuesta: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    crearRespuestaEncuesta(data: {
        userId: string;
        encuestaId: string;
        preguntaId?: string;
        respuesta: string;
        tipoRespuesta: string;
    }): Promise<{
        id: string;
        userId: string;
        encuestaId: string;
        preguntaId: string | null;
        respuesta: string;
        tipoRespuesta: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}

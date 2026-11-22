import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        id: string;
        email: string;
        name: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, body: {
        name?: string;
        role?: string;
    }): Promise<{
        id: string;
        email: string;
        name: string;
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
    getRespuestas(id: string): Promise<({
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
    responderEncuesta(body: any): Promise<{
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

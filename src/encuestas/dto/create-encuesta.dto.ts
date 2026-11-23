import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PreguntaItemDto {
  @ApiPropertyOptional({
    description: 'ID de la pregunta (solo necesario al editar una pregunta existente)',
    example: 'clx123abc456',
  })
  id?: string;

  @ApiProperty({
    description: 'Texto de la pregunta',
    example: '¿Cuál es su nivel de satisfacción general?',
  })
  texto: string;

  @ApiProperty({
    enum: ['ESTRELLAS', 'TEXTO', 'MULTIPLE'],
    example: 'ESTRELLAS',
  })
  tipo: 'ESTRELLAS' | 'TEXTO' | 'MULTIPLE';

  @ApiPropertyOptional({
    default: true,
    example: true,
  })
  obligatoria?: boolean;

  @ApiPropertyOptional({
    description: 'Opciones cuando el tipo es MULTIPLE',
    type: [String],
    example: ['Excelente', 'Bueno', 'Regular', 'Malo'],
  })
  opciones?: string[];
}

export class CreateEncuestaDto {
  @ApiProperty({
    description: 'Nombre de la entidad, local o producto a evaluar',
    example: 'Sucursal Principal',
  })
  nombreEntidad: string;

  @ApiProperty({
    enum: ['PRODUCTO', 'LOCAL', 'PERSONA', 'OTRO'],
    example: 'LOCAL',
  })
  tipoEntidad: 'PRODUCTO' | 'LOCAL' | 'PERSONA' | 'OTRO';

  @ApiPropertyOptional({
    description: 'Descripción opcional de la encuesta',
    example: 'Encuesta de atención al cliente',
  })
  descripcion?: string;

  @ApiPropertyOptional({
    type: [PreguntaItemDto],
    description: 'Lista de preguntas de la encuesta',
  })
  preguntas?: PreguntaItemDto[];
}
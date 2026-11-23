import { ApiPropertyOptional } from '@nestjs/swagger';
import { PreguntaItemDto } from './create-encuesta.dto';

export class UpdateEncuestaDto {
  @ApiPropertyOptional({
    description: 'Nombre de la entidad a evaluar',
    example: 'Sucursal Norte Actualizada',
  })
  nombreEntidad?: string;

  @ApiPropertyOptional({
    enum: ['PRODUCTO', 'LOCAL', 'PERSONA', 'OTRO'],
    example: 'LOCAL',
  })
  tipoEntidad?: 'PRODUCTO' | 'LOCAL' | 'PERSONA' | 'OTRO';

  @ApiPropertyOptional({
    description: 'Descripción de la encuesta',
    example: 'Nueva descripción',
    nullable: true,
  })
  descripcion?: string | null;

  @ApiPropertyOptional({
    description: 'Estado activo o inactivo de la encuesta',
    example: true,
  })
  activo?: boolean;

  @ApiPropertyOptional({
    type: [PreguntaItemDto],
    description: 'Lista completa de preguntas (actualiza existentes, crea nuevas y elimina las omitidas)',
  })
  preguntas?: PreguntaItemDto[];
}
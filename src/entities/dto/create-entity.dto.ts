import { IsString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum EntityType {
  BUSINESS = 'BUSINESS',
  PERSON = 'PERSON',
}

export class CreateEntityDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

   @ApiProperty({ enum: ['BUSINESS', 'PERSON'] })
  type: 'BUSINESS' | 'PERSON';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  position?: string;
}

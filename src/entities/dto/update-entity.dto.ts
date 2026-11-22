import { IsString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum EntityType {
  BUSINESS = 'BUSINESS',
  PERSON = 'PERSON',
}

export class UpdateEntityDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ enum: EntityType })
  @IsOptional()
  @IsIn([EntityType.BUSINESS, EntityType.PERSON])
  type?: EntityType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  position?: string;
}

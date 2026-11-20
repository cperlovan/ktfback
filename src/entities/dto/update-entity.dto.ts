import { IsString, IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEntityDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ enum: ['BUSINESS', 'PERSON'] })
  @IsOptional()
  @IsIn(['BUSINESS', 'PERSON'])
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  position?: string;
}
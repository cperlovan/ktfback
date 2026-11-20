import { IsString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEntityDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ enum: ['BUSINESS', 'PERSON'] })
  @IsIn(['BUSINESS', 'PERSON'])
  type: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  position?: string;
}
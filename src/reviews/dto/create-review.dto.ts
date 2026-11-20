import { IsString, IsNumber, Min, Max, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty()
  @IsString()
  locationId: string;

  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty()
  @IsString()
  comment: string;

  @ApiProperty({ enum: ['SERVICE', 'PRODUCT', 'PRICE', 'AMBIENTE', 'ENTREGA'] })
  @IsString()
  @IsOptional()
  category?: 'SERVICE' | 'PRODUCT' | 'PRICE' | 'AMBIENTE' | 'ENTREGA';

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isApproved?: boolean;
}
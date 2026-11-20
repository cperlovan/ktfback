import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('reviews')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a review for an entity' })
  create(@Body() createReviewDto: CreateReviewDto, @Request() req) {
    return this.reviewsService.create(createReviewDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews' })
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get('location/:locationId')
  @ApiOperation({ summary: 'Get reviews for a specific location' })
  findByLocation(@Param('locationId') locationId: string) {
    return this.reviewsService.findByLocation(locationId);
  }

  @Get('user')
  @ApiOperation({ summary: 'Get reviews by current user' })
  findByUser(@Request() req) {
    return this.reviewsService.findByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review by ID' })
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a review' })
  update(@Param('id') id: string, @Body() data: { rating?: number; comment?: string; isApproved?: boolean }, @Request() req) {
    return this.reviewsService.update(id, data, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a review' })
  remove(@Param('id') id: string, @Request() req) {
    return this.reviewsService.remove(id, req.user.id);
  }

  // Nuevo endpoint: Votar útil / no útil
  @Post(':id/helpful')
  @ApiOperation({ summary: 'Votar útil o no útil en una reseña' })
  @ApiResponse({ status: 200, description: 'Conteo actualizado de útiles' })
  helpful(@Param('id') id: string, @Body() { isUp }: { isUp: boolean }, @Request() req) {
    return this.reviewsService.incrementHelpful(id, isUp);
  }

  // Nuevo endpoint: Obtener analytics
  @Get('analytics')
  @ApiOperation({ summary: 'Obtener analytics de reseñas con filtros opcionales' })
  @ApiResponse({ status: 200, description: 'Datos analytics de reseñas' })
  analytics(
    @Query('locationId') locationId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reviewsService.getAnalytics(
      locationId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  // Nuevo endpoint: Aprobar/desaprobar producto
  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Aprobar o desaprobar un producto/servicio' })
  @ApiResponse({ status: 200, description: 'Estado de aprobación actualizado' })
  approve(@Param('id') id: string, @Body() { isApproved }: { isApproved: boolean }, @Request() req) {
    return this.reviewsService.update(id, { isApproved }, req.user.id);
  }

  // Nuevo endpoint: Resumen de todas las ubicaciones con conteo de reviews (para dashboard admin)
  @Get('analytics/summary')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Obtener resumen de ubicaciones con conteo de reviews' })
  @ApiResponse({ status: 200, description: 'Resumen de ubicaciones y reviews' })
  async summary(@Request() req) {
    return this.reviewsService.getLocationSummary();
  }
}
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EncuestasService } from './encuestas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('encuestas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller('encuestas')
export class EncuestasController {
  constructor(private encuestasService: EncuestasService) {}

  @Get()
  @ApiOperation({ summary: 'Get all encuestas' })
  findAll() {
    return this.encuestasService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new encuesta' })
  @ApiResponse({ status: 201, description: 'Encuesta created successfully' })
  create(@Request() req: any, @Body() body: any) {
    const userId = req.user.sub;
    return this.encuestasService.create(
      body.nombreEntidad,
      body.tipoEntidad,
      body.descripcion,
      userId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get encuesta by ID' })
  findOne(@Param('id') id: string) {
    return this.encuestasService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update encuesta' })
  update(@Param('id') id: string, @Body() datos: any) {
    return this.encuestasService.update(id, datos);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete encuesta' })
  remove(@Param('id') id: string) {
    return this.encuestasService.remove(id);
  }
}
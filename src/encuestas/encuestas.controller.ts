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
  UnauthorizedException,
} from '@nestjs/common';
import { EncuestasService } from './encuestas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateEncuestaDto } from './dto/create-encuesta.dto';
import { UpdateEncuestaDto } from './dto/update-encuesta.dto';

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
  create(@Request() req: any, @Body() body: CreateEncuestaDto) {
    const userId = req.user?.sub || req.user?.id || req.user?.userId;
    if (!userId) {
      throw new UnauthorizedException('No se pudo identificar el usuario en el token');
    }

    return this.encuestasService.create(
      body.nombreEntidad,
      body.tipoEntidad,
      body.descripcion,
      userId,
      body.preguntas ?? [],
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get encuesta by ID' })
  findOne(@Param('id') id: string) {
    return this.encuestasService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update encuesta' })
  @ApiResponse({ status: 200, description: 'Encuesta updated successfully' })
  update(@Param('id') id: string, @Body() datos: UpdateEncuestaDto) {
    return this.encuestasService.update(id, datos);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete encuesta' })
  remove(@Param('id') id: string) {
    return this.encuestasService.remove(id);
  }
}
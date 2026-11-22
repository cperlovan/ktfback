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
} from '@nestjs/common';
import { EntitiesService } from './entities.service';
import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';
import { CreateLocationDto } from './dto/create-location.dto';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('entities')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller('entities')
export class EntitiesController {
  constructor(private entitiesService: EntitiesService) { }

@Post()
create(@Body() body: any, @Request() req) {
  const { name, type, position } = body;
  const userId = req.user.id;
  
  if (!name || !type) {
    return { error: 'name y type son requeridos' };
  }
  
  return this.entitiesService.create(name, type, userId, position);
}





  @Get()
  @ApiOperation({ summary: 'Get all entities' })
  findAll() {
    return this.entitiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get entity by ID with locations, photos and reviews' })
  findOne(@Param('id') id: string) {
    return this.entitiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update entity' })
  update(@Param('id') id: string, @Body() updateEntityDto: UpdateEntityDto, @Request() req) {
    return this.entitiesService.update(id, updateEntityDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete entity' })
  remove(@Param('id') id: string, @Request() req) {
    return this.entitiesService.remove(id, req.user.id);
  }

  @Post(':id/locations')
  @ApiOperation({ summary: 'Add location to an entity' })
  addLocation(
    @Param('id') id: string,
    @Body() createLocationDto: CreateLocationDto,
    @Request() req,
  ) {
    return this.entitiesService.createLocation(id, createLocationDto, req.user.id);
  }

  @Post(':id/photos')
  @ApiOperation({ summary: 'Add photo to an entity' })
  addPhoto(
    @Param('id') id: string,
    @Body() createPhotoDto: CreatePhotoDto,
    @Request() req,
  ) {
    return this.entitiesService.createPhoto(id, createPhotoDto, req.user.id);
  }
}
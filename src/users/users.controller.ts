import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  UseGuards,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  update(@Param('id') id: string, body: { name?: string; role?: string }) {
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
  @Get(':id/encuestas-respuestas')
  @ApiOperation({ summary: 'Get user survey responses' })
  async getRespuestas(@Param('id') id: string) {
    return this.usersService.getUserRespuestas(id);
  }

  @Post('responder')
  @ApiOperation({ summary: 'Submit survey answer' })
  async responderEncuesta(@Body() body: any) {
    return this.usersService.crearRespuestaEncuesta(body);
  }

}
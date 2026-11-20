import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';
import { CreateLocationDto } from './dto/create-location.dto';
import { CreatePhotoDto } from './dto/create-photo.dto';

@Injectable()
export class EntitiesService {
  constructor(private prisma: PrismaService) {}

  async create(createEntityDto: CreateEntityDto, userId: string) {
    return this.prisma.entity.create({
      data: {
        ...createEntityDto,
        userId,
      },
      include: {
        locations: true,
        photos: true,
      },
    });
  }

  async findAll() {
    return this.prisma.entity.findMany({
      include: {
        locations: {
          include: {
            reviews: {
              select: {
                rating: true,
              },
            },
          },
        },
        photos: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const entity = await this.prisma.entity.findUnique({
      where: { id },
      include: {
        locations: true,
        photos: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    return entity;
  }

  async update(id: string, updateEntityDto: UpdateEntityDto, userId: string) {
    const entity = await this.prisma.entity.findUnique({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    if (entity.userId !== userId) {
      throw new NotFoundException('Entity not found');
    }

    return this.prisma.entity.update({
      where: { id },
      data: updateEntityDto,
      include: {
        locations: true,
        photos: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    const entity = await this.prisma.entity.findUnique({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    if (entity.userId !== userId) {
      throw new NotFoundException('Entity not found');
    }

    return this.prisma.entity.delete({
      where: { id },
    });
  }

  async createLocation(entityId: string, createLocationDto: CreateLocationDto, userId: string) {
    const entity = await this.prisma.entity.findUnique({
      where: { id: entityId },
    });

    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    if (entity.userId !== userId) {
      throw new NotFoundException('Entity not found');
    }

    return this.prisma.location.create({
      data: {
        ...createLocationDto,
        entityId,
      },
    });
  }

  async createPhoto(entityId: string, createPhotoDto: CreatePhotoDto, userId: string) {
    const entity = await this.prisma.entity.findUnique({
      where: { id: entityId },
    });

    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    if (entity.userId !== userId) {
      throw new NotFoundException('Entity not found');
    }

    return this.prisma.photo.create({
      data: {
        ...createPhotoDto,
        entityId,
      },
    });
  }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto, userId: string) {
    const { locationId, rating, comment, category, isApproved } = createReviewDto;

    const location = await this.prisma.location.findUnique({
      where: { id: locationId },
    });

    if (!location) {
      throw new NotFoundException('Location not found');
    }

    return this.prisma.review.create({
      data: {
        rating,
        comment,
        category: category || 'SERVICE',
        thumbsUp: 0,
        thumbsDown: 0,
        isApproved: isApproved || false,
        locationId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        location: {
          select: {
            id: true,
            address: true,
            entity: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.review.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        location: {
          select: {
            id: true,
            address: true,
            entity: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByLocation(locationId: string) {
    return this.prisma.review.findMany({
      where: { locationId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.review.findMany({
      where: { userId },
      include: {
        location: {
          select: {
            id: true,
            address: true,
            entity: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        location: {
          select: {
            id: true,
            address: true,
            entity: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async update(id: string, data: { rating?: number; comment?: string; isApproved?: boolean }, userId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new NotFoundException('Review not found');
    }

    return this.prisma.review.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new NotFoundException('Review not found');
    }

    return this.prisma.review.delete({
      where: { id },
    });
  }

  async incrementHelpful(id: string, isUp: boolean) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (isUp) {
      return this.prisma.review.update({
        where: { id },
        data: { thumbsUp: review.thumbsUp + 1 },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          location: {
            select: {
              id: true,
              address: true,
              entity: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                },
              },
            },
          },
        },
      });
    } else {
      const { isApproved, ...data } = review;
      return this.prisma.review.update({
        where: { id },
        data: { ...data, thumbsDown: (review.thumbsDown || 0) + 1, isApproved },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          location: {
            select: {
              id: true,
              address: true,
              entity: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                },
              },
            },
          },
        },
      });
    }
  }

  async getLocationSummary() {
    const locations = await this.prisma.location.findMany({
      include: {
        entity: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Para cada location, calcular rating promedio de sus reviews
    const summary = await Promise.all(
      locations.map(async (loc) => {
        const reviews = await this.prisma.review.findMany({
          where: { locationId: loc.id },
          select: { rating: true, isApproved: true },
        });

        const totalReviews = reviews.length;
        const averageRating =
          totalReviews > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
            : 0;
        const approvedCount = reviews.filter((r) => r.isApproved).length;

        return {
          locationId: loc.id,
          locationAddress: loc.address,
          entityName: loc.entity.name,
          entityType: loc.entity.type,
          totalReviews,
          averageRating: Math.round(averageRating * 100) / 100,
          approvedCount,
          pendingReviews: totalReviews - approvedCount,
        };
      }),
    );

    return summary;
  }

  async getAnalytics(locationId?: string, startDate?: Date, endDate?: Date) {
    const where: any = locationId ? { locationId } : {};

    // Filtro por rango de fechas
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const reviews = await this.prisma.review.findMany({
      where,
      select: {
        rating: true,
        category: true,
        thumbsUp: true,
        thumbsDown: true,
        isApproved: true,
        createdAt: true,
      },
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
      : 0;

    // Category distribution
    const categoryCounts: Record<string, number> = {};
    const categoryLabels: Record<string, string> = {
      SERVICE: 'Servicio',
      PRODUCT: 'Producto',
      PRICE: 'Precio',
      AMBIENTE: 'Ambiente',
      ENTREGA: 'Entrega',
    };

    reviews.forEach(r => {
      const cat = r.category || 'SIN CATEGORÍA';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    // Approval stats
    const approvedCount = reviews.filter(r => r.isApproved).length;
    const approvalRate = totalReviews > 0 ? (approvedCount / totalReviews) * 100 : 0;

    // Thumbs stats
    const totalThumbsUp = reviews.reduce((sum, r) => sum + (r.thumbsUp || 0), 0);
    const totalThumbsDown = reviews.reduce((sum, r) => sum + (r.thumbsDown || 0), 0);

    // Category improvement insights
    const improvementInsights: string[] = [];
    
    if (categoryCounts['PRICE'] && categoryCounts['PRICE'] / totalReviews > 0.3) {
      improvementInsights.push('El 30%+ de reseñas mencionan problemas de precio - considerar ajustes de precios');
    }
    if (categoryCounts['SERVICE'] && categoryCounts['SERVICE'] / totalReviews > 0.3) {
      improvementInsights.push('El 30%+ de reseñas mencionan problemas de servicio - capacitar al personal');
    }
    if (categoryCounts['PRODUCT'] && categoryCounts['PRODUCT'] / totalReviews > 0.3) {
      improvementInsights.push('El 30%+ de reseñas mencionan calidad de producto - revisar proveedores');
    }

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 100) / 100,
      categoryDistribution: categoryCounts,
      categoryLabels,
      approvalRate: Math.round(approvalRate * 100) / 100,
      totalThumbsUp,
      totalThumbsDown,
      improvementInsights,
    };
  }
}
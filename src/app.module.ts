import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EntitiesModule } from './entities/entities.module';
import { ReviewsModule } from './reviews/reviews.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UsersModule,
    EntitiesModule,
    ReviewsModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { AuthModule } from '../auth/auth.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([Card]), AuthModule, CategoriesModule],
  controllers: [CardsController],
  providers: [CardsService],
  exports: [CardsService, TypeOrmModule.forFeature([Card])],
})
export class CardsModule {}

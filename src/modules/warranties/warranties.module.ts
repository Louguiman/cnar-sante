import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarrantiesController } from './warranties.controller';
import { WarrantiesService } from './warranties.service';
import { Warranty } from './entities/warranty.entity';
import { AuthModule } from '../auth/auth.module';
import { Service } from '../services/entities/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Warranty, Service]), AuthModule],
  controllers: [WarrantiesController],
  providers: [WarrantiesService],
  exports: [WarrantiesService],
})
export class WarrantiesModule {}

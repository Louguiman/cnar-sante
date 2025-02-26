import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { AppConfigModule } from '../config/config.module';
import { Module } from '@nestjs/common';
import { Category } from '../categories/entities/category.entity';
import { Service } from '../services/entities/service.entity';
import { Warranty } from '../warranties/entities/warranty.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: +configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        ssl: true,
        synchronize: true, // Consider disabling in production
      }),
    }),
    TypeOrmModule.forFeature([Category, Service, Warranty]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class DatabaseModule {}

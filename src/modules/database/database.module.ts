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
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            autoLoadEntities: true,
            ssl: false,
            synchronize: true, // Consider disabling synchronize in production
          };
        }
        // Fallback to individual parameters if DATABASE_URL is not set
        return {
          type: 'postgres',
          host: configService.get<string>('DATABASE_HOST'),
          port: +configService.get<number>('DATABASE_PORT'),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
          autoLoadEntities: true,
          ssl: true, // Ensure ssl is also in fallback
          synchronize: true, // Consider disabling synchronize in production
        };
      },
    }),
    TypeOrmModule.forFeature([Category, Service, Warranty]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class DatabaseModule {}

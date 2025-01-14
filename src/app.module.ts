import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SubscribersModule } from './modules/subscribers/subscribers.module';
import { ServicesModule } from './modules/services/services.module';
import { AppConfigModule } from './modules/config/config.module';
import { DatabaseModule } from './modules/database/database.module';
import { CardsModule } from './modules/cards/cards.module';
import { PartnersModule } from './modules/partners/partners.module';
import { StructuresModule } from './modules/structures/structures.module';
import { WarrantiesModule } from './modules/warranties/warranties.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ConsumptionModule } from './modules/consumption/consumption.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './commons/guards/jwt.guard';
import { RolesGuard } from './commons/guards/roles.guard';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    SubscribersModule,
    ServicesModule,
    AppConfigModule,
    DatabaseModule,
    CardsModule,
    PartnersModule,
    WarrantiesModule,
    CategoriesModule,
    ConsumptionModule,
    StructuresModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}

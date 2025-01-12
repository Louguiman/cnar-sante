import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SubscribersModule } from './modules/subscribers/subscribers.module';
import { ServicesModule } from './modules/services/services.module';
import { BackOfficeModule } from './modules/back-office/back-office.module';
import { AppConfigModule } from './modules/config/config.module';
import { DatabaseModule } from './modules/database/database.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    SubscribersModule,
    ServicesModule,
    BackOfficeModule,
    AppConfigModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

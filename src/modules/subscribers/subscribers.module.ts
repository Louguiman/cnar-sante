import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscribersController } from './subscribers.controller';
import { SubscribersService } from './subscribers.service';
import { Subscriber } from './entities/subscriber.entity';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/entities/user.entity';
import { Card } from '../cards/entities/card.entity';
import { Structure } from '../structures/entities/structure.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscriber, User, Card, Structure]),
    AuthModule,
  ],
  controllers: [SubscribersController],
  providers: [SubscribersService],
  exports: [SubscribersService],
})
export class SubscribersModule {}

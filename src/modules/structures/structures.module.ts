// src/modules/structures/structures.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StructuresController } from './structures.controller';
import { StructuresService } from './structures.service';
import { Structure } from './entities/structure.entity';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/entities/user.entity';
import { Subscriber } from '../subscribers/entities/subscriber.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Structure, User, Subscriber]),
    AuthModule,
  ],
  controllers: [StructuresController],
  providers: [StructuresService],
  exports: [StructuresService],
})
export class StructuresModule {}

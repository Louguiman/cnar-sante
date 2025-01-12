import { Module } from '@nestjs/common';
import { BackOfficeService } from './back-office.service';
import { BackOfficeController } from './back-office.controller';
import { BackOffice } from './entities/back-office.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BackOffice])],
  controllers: [BackOfficeController],
  providers: [BackOfficeService],
})
export class BackOfficeModule {}

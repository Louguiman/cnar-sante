import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BackOfficeService } from './back-office.service';
import { CreateBackOfficeDto } from './dto/create-back-office.dto';
import { UpdateBackOfficeDto } from './dto/update-back-office.dto';

@Controller('back-office')
export class BackOfficeController {
  constructor(private readonly backOfficeService: BackOfficeService) {}

  @Post()
  create(@Body() createBackOfficeDto: CreateBackOfficeDto) {
    return this.backOfficeService.create(createBackOfficeDto);
  }

  @Get()
  findAll() {
    return this.backOfficeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.backOfficeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBackOfficeDto: UpdateBackOfficeDto) {
    return this.backOfficeService.update(+id, updateBackOfficeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.backOfficeService.remove(+id);
  }
}

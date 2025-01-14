// src/modules/structures/structures.controller.ts
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { StructuresService } from './structures.service';
import { CreateStructureDto } from './dto/create-structure.dto';
import { UpdateStructureDto } from './dto/update-structure.dto';
import { Structure } from './entities/structure.entity';
import { JwtAuthGuard } from 'src/commons/guards/jwt.guard';

@ApiTags('Structures')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('structures')
export class StructuresController {
  constructor(private readonly structuresService: StructuresService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Structure successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  createStructure(
    @Body() createStructureDto: CreateStructureDto,
  ): Promise<Structure> {
    return this.structuresService.createStructure(createStructureDto);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Structure successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Structure not found.' })
  getStructure(@Param('id') id: number): Promise<Structure> {
    return this.structuresService.findStructureById(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Structure successfully updated.' })
  @ApiResponse({ status: 404, description: 'Structure not found.' })
  updateStructure(
    @Param('id') id: number,
    @Body() updateStructureDto: UpdateStructureDto,
  ): Promise<Structure> {
    return this.structuresService.updateStructure(id, updateStructureDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Structure successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Structure not found.' })
  deleteStructure(@Param('id') id: number): Promise<void> {
    return this.structuresService.deleteStructure(id);
  }
}

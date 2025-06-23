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
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger'; // Add ApiOperation
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

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all structures.',
    type: [Structure],
  })
  @ApiOperation({ summary: 'Retrieve all structures' })
  getAllStructures(): Promise<Structure[]> {
    return this.structuresService.findAllStructures();
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

  @Get('search')
  @ApiOperation({ summary: 'Search/filter structures' })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  searchStructures(
    @Query('city') city?: string,
    @Query('type') type?: string,
    @Query('isActive', ParseBoolPipe) isActive?: boolean,
  ): Promise<Structure[]> {
    return this.structuresService.searchStructures({ city, type, isActive });
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get structures by user' })
  getStructuresByUser(@Param('userId') userId: number): Promise<Structure[]> {
    return this.structuresService.getStructuresByUser(userId);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a structure' })
  activateStructure(@Param('id') id: number): Promise<Structure> {
    return this.structuresService.setStructureActive(id, true);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a structure' })
  deactivateStructure(@Param('id') id: number): Promise<Structure> {
    return this.structuresService.setStructureActive(id, false);
  }

  @Get(':id/subscribers')
  @ApiOperation({ summary: 'Get paginated subscribers for a structure' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  getSubscribersForStructure(
    @Param('id') id: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.structuresService.getSubscribersForStructure(
      id,
      Number(page),
      Number(limit),
    );
  }

  @Get(':id/users')
  @ApiOperation({ summary: 'Get users for a structure' })
  getUsersForStructure(@Param('id') id: number) {
    return this.structuresService.getUsersForStructure(id);
  }

  @Post('import')
  @ApiOperation({ summary: 'Bulk import structures (CSV/Excel)' })
  importStructures() {
    // Implementation stub
    return this.structuresService.importStructures();
  }

  @Get('export')
  @ApiOperation({ summary: 'Export all structures (CSV/Excel)' })
  exportStructures() {
    // Implementation stub
    return this.structuresService.exportStructures();
  }

  @Get(':id/statistics')
  @ApiOperation({ summary: 'Get statistics for a structure' })
  getStructureStatistics(@Param('id') id: number) {
    return this.structuresService.getStructureStatistics(id);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get global structures statistics' })
  getGlobalStructuresStatistics() {
    return this.structuresService.getGlobalStructuresStatistics();
  }
}

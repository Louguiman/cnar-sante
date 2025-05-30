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
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger'; // Add ApiOperation
import { WarrantiesService } from './warranties.service';
import { CreateWarrantyDto } from './dto/create-warranty.dto';
import { UpdateWarrantyDto } from './dto/update-warranty.dto';
import { Warranty } from './entities/warranty.entity';
import { JwtAuthGuard } from 'src/commons/guards/jwt.guard';

@ApiTags('Warranties')
@ApiBearerAuth() // Removed duplicate
@UseGuards(JwtAuthGuard)
@Controller('warranties')
export class WarrantiesController {
  constructor(private readonly warrantiesService: WarrantiesService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Warranty successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  createWarranty(
    @Body() createWarrantyDto: CreateWarrantyDto,
  ): Promise<Warranty> {
    return this.warrantiesService.createWarranty(createWarrantyDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Successfully retrieved all warranties.', type: [Warranty] })
  @ApiOperation({ summary: 'Retrieve all warranties' })
  getAllWarranties(): Promise<Warranty[]> {
    return this.warrantiesService.findAllWarranties();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Warranty successfully retrieved.' })
  @ApiResponse({ status: 404, description: 'Warranty not found.' })
  getWarranty(@Param('id') id: number): Promise<Warranty> {
    return this.warrantiesService.findWarrantyById(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Warranty successfully updated.' })
  @ApiResponse({ status: 404, description: 'Warranty not found.' })
  updateWarranty(
    @Param('id') id: number,
    @Body() updateWarrantyDto: UpdateWarrantyDto,
  ): Promise<Warranty> {
    return this.warrantiesService.updateWarranty(id, updateWarrantyDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Warranty successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Warranty not found.' })
  deleteWarranty(@Param('id') id: number): Promise<void> {
    return this.warrantiesService.deleteWarranty(id);
  }
}

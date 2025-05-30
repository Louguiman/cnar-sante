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
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';
import { JwtAuthGuard } from 'src/commons/guards/jwt.guard';

@ApiTags('Services')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Service successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  createService(@Body() createServiceDto: CreateServiceDto): Promise<Service> {
    return this.servicesService.createService(createServiceDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Successfully retrieved all services.', type: [Service] })
  @ApiOperation({ summary: 'Retrieve all services' }) // Added for better Swagger UI
  getAllServices(): Promise<Service[]> {
    return this.servicesService.findAllServices();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Service successfully retrieved.' })
  @ApiResponse({ status: 404, description: 'Service not found.' })
  getService(@Param('id') id: number): Promise<Service> {
    return this.servicesService.findServiceById(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Service successfully updated.' })
  @ApiResponse({ status: 404, description: 'Service not found.' })
  updateService(
    @Param('id') id: number,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    return this.servicesService.updateService(id, updateServiceDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Service successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Service not found.' })
  deleteService(@Param('id') id: number): Promise<void> {
    return this.servicesService.deleteService(id);
  }
}

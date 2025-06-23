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
  UploadedFile,
  Res,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger'; // Add ApiOperation
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';
import { JwtAuthGuard } from 'src/commons/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

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
  getAllServices(@Query('partnerId') partnerId?: number): Promise<Service[]> {
    if (partnerId) {
      return this.servicesService.findServicesByPartner(partnerId);
    }
    return this.servicesService.findAllServices();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search/filter services' })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  searchServices(
    @Query('name') name?: string,
    @Query('category') category?: string,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.servicesService.searchServices({ name, category, isActive });
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get services by category' })
  getServicesByCategory(@Param('categoryId') categoryId: number) {
    return this.servicesService.getServicesByCategory(categoryId);
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

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a service' })
  activateService(@Param('id') id: number) {
    return this.servicesService.setServiceActive(id, true);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a service' })
  deactivateService(@Param('id') id: number) {
    return this.servicesService.setServiceActive(id, false);
  }

  @Post('import')
  @ApiOperation({ summary: 'Bulk import services (CSV)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  importServices(@UploadedFile() file: any) {
    if (!file) throw new Error('CSV file is required');
    const csv = file.buffer.toString('utf-8');
    return this.servicesService.importServices(csv);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export all services (CSV)' })
  async exportServices(@Res() res: Response) {
    const csv = await this.servicesService.exportServices();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="services.csv"');
    res.status(HttpStatus.OK).send(csv);
  }

  @Get(':id/statistics')
  @ApiOperation({ summary: 'Get statistics for a service' })
  getServiceStatistics(@Param('id') id: number) {
    return this.servicesService.getServiceStatistics(id);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get global services statistics' })
  getGlobalServicesStatistics() {
    return this.servicesService.getGlobalServicesStatistics();
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Service successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Service not found.' })
  deleteService(@Param('id') id: number): Promise<void> {
    return this.servicesService.deleteService(id);
  }
}

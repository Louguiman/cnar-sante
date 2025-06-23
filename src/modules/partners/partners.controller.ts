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
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger'; // Add ApiOperation
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { Partner } from './entities/partner.entity';
import { JwtAuthGuard } from 'src/commons/guards/jwt.guard';

@ApiTags('Partners')
@ApiBearerAuth() // Removed duplicate
@UseGuards(JwtAuthGuard)
@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Partner successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  createPartner(@Body() createPartnerDto: CreatePartnerDto): Promise<Partner> {
    return this.partnersService.createPartner(createPartnerDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all partners.',
    type: [Partner],
  })
  @ApiOperation({ summary: 'Retrieve all partners' }) // Added for better Swagger UI
  getAllPartners(): Promise<Partner[]> {
    return this.partnersService.findAllPartners();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Partner successfully retrieved.' })
  @ApiResponse({ status: 404, description: 'Partner not found.' })
  getPartner(@Param('id') id: number): Promise<Partner> {
    return this.partnersService.findPartnerById(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Partner successfully updated.' })
  @ApiResponse({ status: 404, description: 'Partner not found.' })
  updatePartner(
    @Param('id') id: number,
    @Body() updatePartnerDto: UpdatePartnerDto,
  ): Promise<Partner> {
    return this.partnersService.updatePartner(id, updatePartnerDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Partner successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Partner not found.' })
  deletePartner(@Param('id') id: number): Promise<void> {
    return this.partnersService.deletePartner(id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search/filter partners' })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'status', required: false })
  searchPartners(
    @Query('city') city?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
  ) {
    return this.partnersService.searchPartners({ city, type, status });
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get partners by user' })
  getPartnersByUser(@Param('userId') userId: number) {
    return this.partnersService.getPartnersByUser(userId);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a partner' })
  activatePartner(@Param('id') id: number) {
    return this.partnersService.setPartnerStatus(id, 'active');
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a partner' })
  deactivatePartner(@Param('id') id: number) {
    return this.partnersService.setPartnerStatus(id, 'inactive');
  }

  @Get(':id/users')
  @ApiOperation({ summary: 'Get users for a partner' })
  getUsersForPartner(@Param('id') id: number) {
    return this.partnersService.getUsersForPartner(id);
  }

  @Get(':id/services')
  @ApiOperation({ summary: 'Get services for a partner' })
  getServicesForPartner(@Param('id') id: number) {
    return this.partnersService.getServicesForPartner(id);
  }

  @Post('import')
  @ApiOperation({ summary: 'Bulk import partners (CSV/Excel)' })
  importPartners() {
    // Implementation stub
    return this.partnersService.importPartners();
  }

  @Get('export')
  @ApiOperation({ summary: 'Export all partners (CSV/Excel)' })
  exportPartners() {
    // Implementation stub
    return this.partnersService.exportPartners();
  }

  @Get(':id/statistics')
  @ApiOperation({ summary: 'Get statistics for a partner' })
  getPartnerStatistics(@Param('id') id: number) {
    return this.partnersService.getPartnerStatistics(id);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get global partners statistics' })
  getGlobalPartnersStatistics() {
    return this.partnersService.getGlobalPartnersStatistics();
  }
}

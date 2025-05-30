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
  @ApiResponse({ status: 200, description: 'Successfully retrieved all partners.', type: [Partner] })
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
}

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
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiBody,
} from '@nestjs/swagger';
import { ConsumptionService } from './consumption.service';
import { CreateConsumptionDto } from './dto/create-consumption.dto';
import { UpdateConsumptionDto } from './dto/update-consumption.dto';
import { Consumption } from './entities/consumption.entity';
import { JwtAuthGuard } from 'src/commons/guards/jwt.guard';
import { TrackConsumptionDto } from './dto/track-consumption.dto';

@ApiTags('Consumption')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('consumption')
export class ConsumptionController {
  constructor(private readonly consumptionService: ConsumptionService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Consumption successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  createConsumption(
    @Body() createConsumptionDto: CreateConsumptionDto,
  ): Promise<Consumption> {
    return this.consumptionService.createConsumption(createConsumptionDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all consumptions.',
    type: [Consumption],
  })
  @ApiOperation({ summary: 'Retrieve all consumptions' }) // Added for better Swagger UI
  getAllConsumptions(): Promise<Consumption[]> {
    return this.consumptionService.findAllConsumptions();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Consumption successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Consumption not found.' })
  getConsumption(@Param('id') id: number): Promise<Consumption> {
    return this.consumptionService.findConsumptionById(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Consumption successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Consumption not found.' })
  updateConsumption(
    @Param('id') id: number,
    @Body() updateConsumptionDto: UpdateConsumptionDto,
  ): Promise<Consumption> {
    return this.consumptionService.updateConsumption(id, updateConsumptionDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Consumption successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Consumption not found.' })
  deleteConsumption(@Param('id') id: number): Promise<void> {
    return this.consumptionService.deleteConsumption(id);
  }

  @Post('track')
  @ApiOperation({
    summary: 'Track a new validated consumption on a card (with partner)',
  })
  @ApiBody({ type: TrackConsumptionDto })
  async trackConsumption(@Body() body: TrackConsumptionDto) {
    return this.consumptionService.trackConsumption(
      body.cardId,
      body.warrantyId,
      body.amount,
      body.partnerId,
      body.serviceId,
    );
  }
}

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
  @Post()
  @ApiOperation({ summary: 'Track a new consumption on a card' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cardId: { type: 'number' },
        warrantyId: { type: 'number' },
        amount: { type: 'number' },
      },
    },
  })
  async trackConsumption(
    @Body() body: { cardId: number; warrantyId: number; amount: number },
  ) {
    return this.consumptionService.trackConsumption(
      body.cardId,
      body.warrantyId,
      body.amount,
    );
  }
}

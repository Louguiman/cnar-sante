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
} from '@nestjs/swagger'; // Add ApiOperation
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { Subscriber } from './entities/subscriber.entity';
import { JwtAuthGuard } from 'src/commons/guards/jwt.guard';

@ApiTags('Subscribers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Subscriber successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  createSubscriber(
    @Body() createSubscriberDto: CreateSubscriberDto,
  ): Promise<Subscriber> {
    return this.subscribersService.createSubscriber(createSubscriberDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all subscribers.',
    type: [Subscriber],
  })
  @ApiOperation({ summary: 'Retrieve all subscribers' })
  getAllSubscribers(): Promise<Subscriber[]> {
    return this.subscribersService.findAllSubscribers();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Subscriber successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Subscriber not found.' })
  getSubscriber(@Param('id') id: number): Promise<Subscriber> {
    return this.subscribersService.findSubscriberById(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Subscriber successfully updated.' })
  @ApiResponse({ status: 404, description: 'Subscriber not found.' })
  updateSubscriber(
    @Param('id') id: number,
    @Body() updateSubscriberDto: UpdateSubscriberDto,
  ): Promise<Subscriber> {
    return this.subscribersService.updateSubscriber(id, updateSubscriberDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Subscriber successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Subscriber not found.' })
  deleteSubscriber(@Param('id') id: number): Promise<void> {
    return this.subscribersService.deleteSubscriber(id);
  }

  @Get(':id/consumptions')
  @ApiOperation({ summary: 'Get all consumptions for a subscriber' })
  async getConsumptionsForSubscriber(@Param('id') id: number) {
    return this.subscribersService.getConsumptionsForSubscriber(id);
  }
}

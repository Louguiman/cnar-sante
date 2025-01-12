import { Controller, Get, Param } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';

@Controller('subscribers')
export class SubscribersController {
  constructor(private subscribersService: SubscribersService) {}

  @Get(':id')
  async getSubscriberDetails(@Param('id') id: number) {
    return this.subscribersService.getSubscriberDetails(id);
  }
}

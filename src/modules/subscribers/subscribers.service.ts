import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscriber } from './entities/subscriber.entity';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectRepository(Subscriber)
    private subscribersRepository: Repository<Subscriber>,
  ) {}

  async create(subscriberDto): Promise<Subscriber> {
    return this.subscribersRepository.save(subscriberDto);
  }

  async getSubscriberDetails(id: number): Promise<Subscriber> {
    return this.subscribersRepository.findOneBy({ subscriberId: id });
  }
}

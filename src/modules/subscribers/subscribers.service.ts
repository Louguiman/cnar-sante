import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscriber } from './entities/subscriber.entity';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepo: Repository<Subscriber>,
  ) {}

  async createSubscriber(
    createSubscriberDto: CreateSubscriberDto,
  ): Promise<Subscriber> {
    const subscriber = this.subscriberRepo.create(createSubscriberDto);
    return this.subscriberRepo.save(subscriber);
  }

  async findSubscriberById(id: number): Promise<Subscriber> {
    const subscriber = await this.subscriberRepo.findOne({ where: { id } });
    if (!subscriber) throw new NotFoundException('Subscriber not found');
    return subscriber;
  }

  async findAllSubscribers(): Promise<Subscriber[]> {
    return this.subscriberRepo.find();
  }

  async updateSubscriber(
    id: number,
    updateSubscriberDto: UpdateSubscriberDto,
  ): Promise<Subscriber> {
    const subscriber = await this.findSubscriberById(id);
    Object.assign(subscriber, updateSubscriberDto);
    return this.subscriberRepo.save(subscriber);
  }

  async deleteSubscriber(id: number): Promise<void> {
    const subscriber = await this.findSubscriberById(id);
    await this.subscriberRepo.remove(subscriber);
  }
}

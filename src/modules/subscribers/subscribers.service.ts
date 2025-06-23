import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscriber } from './entities/subscriber.entity';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { User } from '../users/entities/user.entity';
import { Card } from '../cards/entities/card.entity';
import { Structure } from '../structures/entities/structure.entity';
import { Consumption } from '../consumption/entities/consumption.entity';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepo: Repository<Subscriber>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Card)
    private readonly cardRepo: Repository<Card>,
    @InjectRepository(Structure)
    private readonly structureRepo: Repository<Structure>,
    @InjectRepository(Consumption)
    private readonly consumptionRepo: Repository<Consumption>,
  ) {}

  async createSubscriber(
    createSubscriberDto: CreateSubscriberDto,
  ): Promise<Subscriber> {
    const { userId, cardId, structureId, ...rest } = createSubscriberDto;
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');
    let card = null;
    if (cardId !== undefined) {
      card = await this.cardRepo.findOne({ where: { id: cardId } });
      if (!card) throw new BadRequestException('Card not found');
    }
    const structure = await this.structureRepo.findOne({
      where: { id: structureId },
    });
    if (!structure) throw new BadRequestException('Structure not found');
    const subscriber = this.subscriberRepo.create({
      ...rest,
      user,
      card,
      structure,
    });
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
    const { userId, cardId, structureId, ...rest } = updateSubscriberDto;
    if (userId !== undefined) {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) throw new BadRequestException('User not found');
      subscriber.user = user;
    }
    if (cardId !== undefined) {
      const card = await this.cardRepo.findOne({ where: { id: cardId } });
      if (!card) throw new BadRequestException('Card not found');
      subscriber.card = card;
    }
    if (structureId !== undefined) {
      const structure = await this.structureRepo.findOne({
        where: { id: structureId },
      });
      if (!structure) throw new BadRequestException('Structure not found');
      subscriber.structure = structure;
    }
    Object.assign(subscriber, rest);
    return this.subscriberRepo.save(subscriber);
  }

  async deleteSubscriber(id: number): Promise<void> {
    const subscriber = await this.findSubscriberById(id);
    await this.subscriberRepo.remove(subscriber);
  }

  async getConsumptionsForSubscriber(subscriberId: number) {
    // Find the subscriber and their card
    const subscriber = await this.subscriberRepo.findOne({
      where: { id: subscriberId },
      relations: ['card'],
    });
    if (!subscriber || !subscriber.card) return [];
    // Find all consumptions for the card
    return this.consumptionRepo.find({
      where: { card: { id: subscriber.card.id } },
      relations: ['warranty', 'card'],
    });
  }

  async findSubscribersByStructure(structureId: number): Promise<Subscriber[]> {
    return this.subscriberRepo.find({
      where: { structure: { id: structureId } },
      relations: ['structure'],
    });
  }

  async findSubscriberByUserId(userId: number): Promise<Subscriber> {
    const subscriber = await this.subscriberRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!subscriber) throw new NotFoundException('Subscriber not found');
    return subscriber;
  }
}

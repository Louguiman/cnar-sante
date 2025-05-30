import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './entities/card.entity';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepo: Repository<Card>,
  ) {}

  async createCard(cardData: Partial<Card>): Promise<Card> {
    const card = this.cardRepo.create(cardData);
    return this.cardRepo.save(card);
  }

  async findCardById(id: number): Promise<Card> {
    const card = await this.cardRepo.findOne({ where: { id } });
    if (!card) throw new NotFoundException('Card not found');
    return card;
  }

  async findAllCards(): Promise<Card[]> {
    return this.cardRepo.find();
  }

  async updateCard(id: number, cardData: Partial<Card>): Promise<Card> {
    const card = await this.findCardById(id);
    Object.assign(card, cardData);
    return this.cardRepo.save(card);
  }

  async deleteCard(id: number): Promise<void> {
    const card = await this.findCardById(id);
    await this.cardRepo.remove(card);
  }

  async rechargeCard(cardId: number, amount: number): Promise<Card> {
    const card = await this.cardRepo.findOne({ where: { id: cardId } });
    if (!card) throw new BadRequestException('Card not found');

    card.balance += amount;
    card.totalRemaining += amount;

    return this.cardRepo.save(card);
  }
}

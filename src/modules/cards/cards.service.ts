import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './entities/card.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepo: Repository<Card>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async createCard(
    cardData: Partial<Card> & { categoryId?: number },
  ): Promise<Card> {
    let category = null;
    if (cardData.categoryId) {
      category = await this.categoryRepo.findOne({
        where: { id: cardData.categoryId },
      });
      if (!category) throw new BadRequestException('Category not found');
    }
    const card = this.cardRepo.create({ ...cardData, category });
    return this.cardRepo.save(card);
  }

  async findCardById(id: number): Promise<Card> {
    const card = await this.cardRepo.findOne({
      where: { id },
      relations: ['subscriber'],
    });
    if (!card) throw new NotFoundException('Card not found');
    return card;
  }

  async findAllCards(): Promise<Card[]> {
    return this.cardRepo.find({ relations: ['subscriber'] });
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

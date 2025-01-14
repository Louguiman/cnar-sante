// consumption.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consumption } from './entities/consumption.entity';
import { Card } from '../cards/entities/card.entity';
import { Warranty } from '../warranties/entities/warranty.entity';
import { CreateConsumptionDto } from './dto/create-consumption.dto';
import { UpdateConsumptionDto } from './dto/update-consumption.dto';

@Injectable()
export class ConsumptionService {
  constructor(
    @InjectRepository(Consumption)
    private readonly consumptionRepo: Repository<Consumption>,
    @InjectRepository(Card)
    private readonly cardRepo: Repository<Card>,
    @InjectRepository(Warranty)
    private readonly warrantyRepo: Repository<Warranty>,
  ) {}

  async createConsumption(
    createConsumptionDto: CreateConsumptionDto,
  ): Promise<Consumption> {
    const consumption = this.consumptionRepo.create(createConsumptionDto);
    return this.consumptionRepo.save(consumption);
  }

  async findConsumptionById(id: number): Promise<Consumption> {
    const consumption = await this.consumptionRepo.findOne({ where: { id } });
    if (!consumption) throw new NotFoundException('Consumption not found');
    return consumption;
  }

  async updateConsumption(
    id: number,
    updateConsumptionDto: UpdateConsumptionDto,
  ): Promise<Consumption> {
    const consumption = await this.findConsumptionById(id);
    Object.assign(consumption, updateConsumptionDto);
    return this.consumptionRepo.save(consumption);
  }

  async deleteConsumption(id: number): Promise<void> {
    const consumption = await this.findConsumptionById(id);
    await this.consumptionRepo.remove(consumption);
  }

  async trackConsumption(
    cardId: number,
    warrantyId: number,
    amount: number,
  ): Promise<Consumption> {
    const card = await this.cardRepo.findOne({ where: { id: cardId } });
    if (!card) throw new BadRequestException('Card not found');

    if (card.balance < amount) {
      throw new BadRequestException('Insufficient card balance');
    }

    const warranty = await this.warrantyRepo.findOne({
      where: { id: warrantyId },
    });
    if (!warranty) throw new BadRequestException('Warranty not found');

    if (warranty.limit < amount) {
      throw new BadRequestException('Exceeds warranty coverage limit');
    }

    card.balance -= amount;

    await this.cardRepo.save(card);
    const consumption = this.consumptionRepo.create({
      card,
      warranty,
      amount,
      remainingBalance: card.balance,
    });

    return this.consumptionRepo.save(consumption);
  }

  // 1. Add event-based notifications for consumption (e.g., send alerts when nearing limits).
  async notifyLowBalance(cardId: number): Promise<void> {
    const card = await this.cardRepo.findOne({ where: { id: cardId } });
    if (card && card.balance < 5000) {
      // Send notification logic here (e.g., email or SMS alert)
      console.log(`Card ${card.cardNo} is running low on balance.`);
    }
  }
}

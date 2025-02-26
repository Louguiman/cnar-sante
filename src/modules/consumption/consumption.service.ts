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
    const card = await this.cardRepo.findOne({
      where: { id: cardId },
      relations: ['category'], // Fetch category for total cap check
    });
    if (!card) throw new BadRequestException('Card not found');

    const warranty = await this.warrantyRepo.findOne({
      where: { id: warrantyId },
      relations: ['service', 'category'], // Fetch service and category for limit checks
    });
    if (!warranty) throw new BadRequestException('Warranty not found');

    // 1️⃣ ✅ Check if card has enough balance
    if (card.balance < amount) {
      throw new BadRequestException('Insufficient card balance');
    }

    // 2️⃣ ✅ Check if the amount exceeds the warranty limit
    if (warranty.limit && amount > warranty.limit) {
      throw new BadRequestException(
        `Exceeds warranty coverage limit (${warranty.limit} FCFA per act)`,
      );
    }

    // 3️⃣ ✅ Check total spent on this warranty for the year
    const yearStart = new Date(new Date().getFullYear(), 0, 1); // First day of the year

    const totalSpentOnWarranty = await this.consumptionRepo
      .createQueryBuilder('consumption')
      .where('consumption.cardId = :cardId', { cardId })
      .andWhere('consumption.warrantyId = :warrantyId', { warrantyId })
      .andWhere('consumption.createdAt >= :yearStart', { yearStart })
      .select('SUM(consumption.amount)', 'total')
      .getRawOne();

    const totalSpent = totalSpentOnWarranty?.total || 0;
    if (warranty.limit && totalSpent + amount > warranty.limit) {
      throw new BadRequestException(
        `This warranty has an annual limit of ${warranty.limit} FCFA`,
      );
    }

    // 4️⃣ ✅ Check category-level cap (200,000 FCFA for minors, 500,000+ for adults)
    const totalSpentOnCard = await this.consumptionRepo
      .createQueryBuilder('consumption')
      .where('consumption.cardId = :cardId', { cardId })
      .andWhere('consumption.createdAt >= :yearStart', { yearStart })
      .select('SUM(consumption.amount)', 'total')
      .getRawOne();

    const totalSpentThisYear = totalSpentOnCard?.total || 0;
    const categoryLimit = card.category.name === 'Mineur' ? 200000 : 500000;

    if (totalSpentThisYear + amount > categoryLimit) {
      throw new BadRequestException(
        `Annual spending cap reached (${categoryLimit} FCFA)`,
      );
    }

    // 5️⃣ ✅ Deduct amount from card balance
    card.balance -= amount;
    await this.cardRepo.save(card);

    // 6️⃣ ✅ Log the consumption
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

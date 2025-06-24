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
    const { cardId, warrantyId, ...rest } = createConsumptionDto;
    const card = await this.cardRepo.findOne({ where: { id: cardId } });
    if (!card) throw new BadRequestException('Card not found');
    const warranty = await this.warrantyRepo.findOne({
      where: { id: warrantyId },
    });
    if (!warranty) throw new BadRequestException('Warranty not found');
    const consumption = this.consumptionRepo.create({
      ...rest,
      card,
      warranty,
    });
    return this.consumptionRepo.save(consumption);
  }

  async findConsumptionById(id: number): Promise<Consumption> {
    const consumption = await this.consumptionRepo.findOne({ where: { id } });
    if (!consumption) throw new NotFoundException('Consumption not found');
    return consumption;
  }

  async findAllConsumptions(): Promise<Consumption[]> {
    return this.consumptionRepo.find({ relations: ['card', 'warranty'] }); // Added relations for context
  }

  async updateConsumption(
    id: number,
    updateConsumptionDto: UpdateConsumptionDto,
  ): Promise<Consumption> {
    const consumption = await this.findConsumptionById(id);
    const { cardId, warrantyId, ...rest } = updateConsumptionDto;

    // Resolve and assign card if cardId is present
    if (cardId !== undefined) {
      const card = await this.cardRepo.findOne({ where: { id: cardId } });
      if (!card) throw new BadRequestException('Card not found');
      consumption.card = card;
    }
    // Resolve and assign warranty if warrantyId is present
    if (warrantyId !== undefined) {
      const warranty = await this.warrantyRepo.findOne({
        where: { id: warrantyId },
      });
      if (!warranty) throw new BadRequestException('Warranty not found');
      consumption.warranty = warranty;
    }
    Object.assign(consumption, rest);
    return this.consumptionRepo.save(consumption);
  }

  async deleteConsumption(id: number): Promise<void> {
    const consumption = await this.findConsumptionById(id);
    await this.consumptionRepo.remove(consumption);
  }

  async trackConsumption(
    cardNo: number,
    warrantyId: number,
    amount: number,
    partnerId?: number,
    serviceId?: number,
  ): Promise<any> {
    const card = await this.cardRepo.findOne({
      where: { cardNo: String(cardNo) },
      relations: ['category'],
    });
    if (!card) throw new BadRequestException('Card not found');

    // Use serviceId if provided, otherwise get from warranty
    let service = undefined;
    if (serviceId) {
      service = await this.warrantyRepo.manager
        .getRepository('Service')
        .findOne({ where: { id: serviceId } });
      if (!service) throw new BadRequestException('Service not found');
    }

    const warranty = await this.warrantyRepo.findOne({
      where: { id: warrantyId },
      relations: ['service', 'category'],
    });
    if (!warranty) throw new BadRequestException('Warranty not found');
    if (!service) service = warranty.service;

    // 1️⃣ Check if card has enough balance
    if (card.balance < amount) {
      throw new BadRequestException('Insufficient card balance');
    }

    // 2️⃣ Check if the amount exceeds the warranty limit (per act)
    if (warranty.limit && amount > warranty.limit) {
      throw new BadRequestException(
        `Exceeds warranty coverage limit (${warranty.limit} FCFA per act)`,
      );
    }

    // 3️⃣ Check total spent on this warranty for the year
    const yearStart = new Date(new Date().getFullYear(), 0, 1);
    const totalSpentOnWarranty = await this.consumptionRepo
      .createQueryBuilder('consumption')
      .where('consumption.cardId = :cardId', { cardId: card.id })
      .andWhere('consumption.warrantyId = :warrantyId', { warrantyId })
      .andWhere('consumption.createdAt >= :yearStart', { yearStart })
      .select('SUM(consumption.amount)', 'total')
      .getRawOne();
    const totalSpent = Number(totalSpentOnWarranty?.total) || 0;
    if (warranty.limit && totalSpent + amount > warranty.limit) {
      throw new BadRequestException(
        `This warranty has an annual limit of ${warranty.limit} FCFA`,
      );
    }

    // 4️⃣ Check service limit and limitType
    if (service && service.limit && service.limitType) {
      let serviceWindowStart: Date | undefined;
      if (service.limitType === 'per year') {
        serviceWindowStart = new Date(new Date().getFullYear(), 0, 1);
      } else if (service.limitType === 'per day') {
        const now = new Date();
        serviceWindowStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );
      } // Add more limit types as needed
      let totalServiceSpent = 0;
      if (serviceWindowStart) {
        const res = await this.consumptionRepo
          .createQueryBuilder('consumption')
          .where('consumption.cardId = :cardId', { cardId: card.id })
          .andWhere('consumption.warrantyId = :warrantyId', { warrantyId })
          .andWhere('consumption.createdAt >= :windowStart', {
            windowStart: serviceWindowStart,
          })
          .select('SUM(consumption.amount)', 'total')
          .getRawOne();
        totalServiceSpent = Number(res?.total) || 0;
      }
      if (service.limitType === 'per act') {
        if (amount > service.limit) {
          throw new BadRequestException(
            `Exceeds service limit (${service.limit} FCFA per act)`,
          );
        }
      } else if (
        service.limit &&
        serviceWindowStart &&
        totalServiceSpent + amount > service.limit
      ) {
        throw new BadRequestException(
          `Service limit exceeded (${service.limit} FCFA for ${service.limitType})`,
        );
      }
    }

    // 4️⃣ Check category-level cap (200,000 FCFA for minors, 500,000+ for adults)
    const totalSpentOnCard = await this.consumptionRepo
      .createQueryBuilder('consumption')
      .where('consumption.cardId = :cardId', { cardId: card.id })
      .andWhere('consumption.createdAt >= :yearStart', { yearStart })
      .select('SUM(consumption.amount)', 'total')
      .getRawOne();
    const totalSpentThisYear = Number(totalSpentOnCard?.total) || 0;
    const categoryLimit = card.category.name.toLowerCase().includes('mineur')
      ? 200000
      : 500000;
    if (totalSpentThisYear + amount > categoryLimit) {
      throw new BadRequestException(
        `Annual spending cap reached (${categoryLimit} FCFA)`,
      );
    }

    // 5️⃣ Deduct amount from card balance
    card.balance -= amount;
    await this.cardRepo.save(card);

    // 6️⃣ Log the consumption
    let partner = undefined;
    if (partnerId) {
      partner = await this.consumptionRepo.manager
        .getRepository('Partner')
        .findOne({ where: { id: partnerId } });
    }
    const consumption = this.consumptionRepo.create({
      card,
      warranty,
      amount,
      remainingBalance: card.balance,
      partner,
    });
    const saved = await this.consumptionRepo.save(consumption);

    // 7️⃣ Return a summary
    return {
      success: true,
      message: 'Consumption tracked successfully',
      consumptionId: saved.id,
      cardId: card.id,
      cardNo: card.cardNo,
      cardBalance: card.balance,
      warrantyId: warranty.id,
      warrantyLimit: warranty.limit,
      warrantyCoverageRate: warranty.coverageRate,
      service: warranty.service?.name,
      category: card.category?.name,
      partner: partner ? { id: partner.id, name: partner.name } : null,
      amount,
      remainingBalance: card.balance,
      totalSpentOnWarranty: totalSpent + amount,
      totalSpentThisYear: totalSpentThisYear + amount,
      categoryLimit,
    };
  }

  // 1. Add event-based notifications for consumption (e.g., send alerts when nearing limits).
  async notifyLowBalance(cardId: number): Promise<void> {
    const card = await this.cardRepo.findOne({ where: { id: cardId } });
    if (card && card.balance < 5000) {
      // Send notification logic here (e.g., email or SMS alert)
      console.log(`Card ${card.cardNo} is running low on balance.`);
    }
  }

  async findConsumptionsByPartner(partnerId: number): Promise<Consumption[]> {
    return this.consumptionRepo.find({
      where: { partner: { id: partnerId } },
      relations: ['card', 'warranty', 'partner'],
    });
  }
}

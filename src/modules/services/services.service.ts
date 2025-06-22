// src/modules/services/services.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async createService(
    serviceData: Partial<Service> & { categoryId?: number },
  ): Promise<Service> {
    const { categoryId, ...rest } = serviceData;
    let category: Category | undefined;
    if (categoryId !== undefined) {
      category = await this.categoryRepo.findOne({ where: { id: categoryId } });
      if (!category) throw new BadRequestException('Category not found');
    }
    const service = this.serviceRepo.create({ ...rest, category });
    return this.serviceRepo.save(service);
  }

  async findServiceById(id: number): Promise<Service> {
    const service = await this.serviceRepo.findOne({ where: { id } });
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async findAllServices(): Promise<Service[]> {
    return this.serviceRepo.find();
  }

  async updateService(
    id: number,
    serviceData: Partial<Service> & { categoryId?: number },
  ): Promise<Service> {
    const service = await this.findServiceById(id);
    const { categoryId, ...rest } = serviceData;
    if (categoryId !== undefined) {
      const category = await this.categoryRepo.findOne({
        where: { id: categoryId },
      });
      if (!category) throw new BadRequestException('Category not found');
      service.category = category;
    }
    Object.assign(service, rest);
    return this.serviceRepo.save(service);
  }

  async deleteService(id: number): Promise<void> {
    const service = await this.findServiceById(id);
    await this.serviceRepo.remove(service);
  }
}

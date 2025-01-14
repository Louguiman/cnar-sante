// src/modules/services/services.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
  ) {}

  async createService(serviceData: Partial<Service>): Promise<Service> {
    const service = this.serviceRepo.create(serviceData);
    return this.serviceRepo.save(service);
  }

  async findServiceById(id: number): Promise<Service> {
    const service = await this.serviceRepo.findOne({ where: { id } });
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async updateService(
    id: number,
    serviceData: Partial<Service>,
  ): Promise<Service> {
    const service = await this.findServiceById(id);
    Object.assign(service, serviceData);
    return this.serviceRepo.save(service);
  }

  async deleteService(id: number): Promise<void> {
    const service = await this.findServiceById(id);
    await this.serviceRepo.remove(service);
  }
}

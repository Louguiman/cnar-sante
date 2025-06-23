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

  // Search/filter services
  async searchServices({
    name,
    category,
    isActive,
  }: {
    name?: string;
    category?: string;
    isActive?: boolean;
  }) {
    const qb = this.serviceRepo
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.category', 'category');
    if (name) qb.andWhere('service.name ILIKE :name', { name: `%${name}%` });
    if (category)
      qb.andWhere('category.name ILIKE :category', {
        category: `%${category}%`,
      });
    if (isActive !== undefined)
      qb.andWhere('service.isActive = :isActive', { isActive });
    return qb.getMany();
  }

  // Get services by category
  async getServicesByCategory(categoryId: number) {
    const category = await this.categoryRepo.findOne({
      where: { id: categoryId },
    });
    if (!category) throw new NotFoundException('Category not found');
    return this.serviceRepo.find({ where: { category: { id: categoryId } } });
  }

  // Activate/deactivate service
  async setServiceActive(id: number, active: boolean) {
    const service = await this.findServiceById(id);
    service.isActive = active;
    return this.serviceRepo.save(service);
  }

  // Import services from CSV (stub: expects req.body.csv or similar)
  async importServices(csv?: string) {
    if (!csv) throw new BadRequestException('CSV data required');
    const { csvToServices } = await import('./utils/service-csv.util');
    const serviceDtos = csvToServices(csv);
    const created: Service[] = [];
    for (const dto of serviceDtos) {
      let category = undefined;
      // dto.category should be a string (category name) from CSV
      if (dto.category && typeof dto.category === 'string') {
        category = await this.categoryRepo.findOne({
          where: { name: dto.category },
        });
        if (!category)
          throw new BadRequestException(`Category '${dto.category}' not found`);
      }
      const service = this.serviceRepo.create({ ...dto, category });
      created.push(await this.serviceRepo.save(service));
    }
    return created;
  }

  // Export all services to CSV
  async exportServices() {
    const { servicesToCSV } = await import('./utils/service-csv.util');
    const services = await this.serviceRepo.find({ relations: ['category'] });
    return servicesToCSV(services);
  }

  // Per-service statistics
  async getServiceStatistics(id: number) {
    const service = await this.findServiceById(id);
    // Example: count warranties, partners, etc.
    return {
      id: service.id,
      name: service.name,
      isActive: service.isActive,
      partnersCount: service.partners?.length || 0,
      warrantiesCount: service.warranties?.length || 0,
    };
  }

  // Global statistics
  async getGlobalServicesStatistics() {
    const total = await this.serviceRepo.count();
    const active = await this.serviceRepo.count({ where: { isActive: true } });
    const inactive = total - active;
    const byCategory = await this.serviceRepo
      .createQueryBuilder('service')
      .leftJoin('service.category', 'category')
      .select('category.name', 'category')
      .addSelect('COUNT(service.id)', 'count')
      .groupBy('category.name')
      .getRawMany();
    return { total, active, inactive, byCategory };
  }
}

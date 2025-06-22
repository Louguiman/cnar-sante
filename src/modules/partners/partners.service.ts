import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner } from './entities/partner.entity';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { User } from '../users/entities/user.entity';
import { Service } from '../services/entities/service.entity';

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(Partner)
    private readonly partnerRepo: Repository<Partner>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
  ) {}

  async createPartner(createPartnerDto: CreatePartnerDto): Promise<Partner> {
    const { userId, serviceId, services, ...rest } = createPartnerDto;
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');
    let serviceEntities: Service[] = [];
    if (Array.isArray(services) && services.length > 0) {
      serviceEntities = await this.serviceRepo.findByIds(
        services.map((s) => (typeof s === 'number' ? s : s.id)),
      );
      if (serviceEntities.length !== services.length)
        throw new BadRequestException('One or more services not found');
    } else if (serviceId !== undefined) {
      const service = await this.serviceRepo.findOne({
        where: { id: serviceId },
      });
      if (!service) throw new BadRequestException('Service not found');
      serviceEntities = [service];
    }
    const partner = this.partnerRepo.create({
      ...rest,
      users: [user],
      services: serviceEntities,
    });
    return this.partnerRepo.save(partner);
  }

  async findPartnerById(id: number): Promise<Partner> {
    const partner = await this.partnerRepo.findOne({ where: { id } });
    if (!partner) throw new NotFoundException('Partner not found');
    return partner;
  }

  async findAllPartners(): Promise<Partner[]> {
    return this.partnerRepo.find();
  }

  async updatePartner(
    id: number,
    updatePartnerDto: UpdatePartnerDto,
  ): Promise<Partner> {
    const partner = await this.findPartnerById(id);
    const { userId, serviceId, services, ...rest } = updatePartnerDto;
    if (userId !== undefined) {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) throw new BadRequestException('User not found');
      partner.users = [user];
    }
    if (Array.isArray(services) && services.length > 0) {
      const serviceEntities = await this.serviceRepo.findByIds(
        services.map((s) => (typeof s === 'number' ? s : s.id)),
      );
      if (serviceEntities.length !== services.length)
        throw new BadRequestException('One or more services not found');
      partner.services = serviceEntities;
    } else if (serviceId !== undefined) {
      const service = await this.serviceRepo.findOne({
        where: { id: serviceId },
      });
      if (!service) throw new BadRequestException('Service not found');
      partner.services = [service];
    }
    Object.assign(partner, rest);
    return this.partnerRepo.save(partner);
  }

  async deletePartner(id: number): Promise<void> {
    const partner = await this.findPartnerById(id);
    await this.partnerRepo.remove(partner);
  }
}

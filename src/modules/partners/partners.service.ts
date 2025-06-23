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
import { partnersToCSV, csvToPartners } from './utils/partner-csv.util';

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
    const { userId, services, ...rest } = createPartnerDto;
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');
    let serviceEntities: Service[] = [];
    if (Array.isArray(services) && services.length > 0) {
      serviceEntities = await this.serviceRepo.findByIds(
        services.map((s) => (typeof s === 'number' ? s : s.id)),
      );
      if (serviceEntities.length !== services.length)
        throw new BadRequestException('One or more services not found');
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
    const { userId, services, ...rest } = updatePartnerDto;
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
    }
    Object.assign(partner, rest);
    return this.partnerRepo.save(partner);
  }

  async deletePartner(id: number): Promise<void> {
    const partner = await this.findPartnerById(id);
    await this.partnerRepo.remove(partner);
  }

  async searchPartners({
    city,
    type,
    status,
  }: {
    city?: string;
    type?: string;
    status?: string;
  }) {
    const qb = this.partnerRepo.createQueryBuilder('partner');
    if (city) qb.andWhere('partner.city = :city', { city });
    if (type) qb.andWhere('partner.type = :type', { type });
    if (status) qb.andWhere('partner.status = :status', { status });
    return qb.getMany();
  }

  async getPartnersByUser(userId: number) {
    return this.partnerRepo
      .createQueryBuilder('partner')
      .leftJoin('partner.users', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  async setPartnerStatus(
    id: number,
    status: 'active' | 'pending' | 'inactive',
  ): Promise<Partner> {
    if (!['active', 'pending', 'inactive'].includes(status)) {
      throw new BadRequestException('Invalid status value');
    }
    const partner = await this.findPartnerById(id);
    partner.status = status;
    return this.partnerRepo.save(partner);
  }

  async getUsersForPartner(id: number) {
    const partner = await this.findPartnerById(id);
    return partner.users;
  }

  async getServicesForPartner(id: number) {
    const partner = await this.findPartnerById(id);
    return partner.services;
  }

  async importPartners(
    csvData?: string,
  ): Promise<{ imported: number; errors: any[] }> {
    if (!csvData) return { imported: 0, errors: ['No CSV data provided'] };
    const records = csvToPartners(csvData);
    let imported = 0;
    const errors = [];
    for (const rec of records) {
      try {
        const partner = this.partnerRepo.create(rec);
        await this.partnerRepo.save(partner);
        imported++;
      } catch (e) {
        errors.push({ record: rec, error: e.message });
      }
    }
    return { imported, errors };
  }

  async exportPartners(): Promise<{ csv: string }> {
    const partners = await this.partnerRepo.find();
    const csv = partnersToCSV(partners);
    return { csv };
  }

  async getPartnerStatistics(id: number): Promise<any> {
    const partner = await this.findPartnerById(id);
    const userCount = partner.users?.length || 0;
    const serviceCount = partner.services?.length || 0;
    return {
      partnerId: partner.id,
      name: partner.name,
      userCount,
      serviceCount,
      status: partner.status,
      createdAt: partner.createdAt,
    };
  }

  async getGlobalPartnersStatistics(): Promise<any> {
    const totalPartners = await this.partnerRepo.count();
    const activePartners = await this.partnerRepo.count({
      where: { status: 'active' },
    });
    const pendingPartners = await this.partnerRepo.count({
      where: { status: 'pending' },
    });
    const inactivePartners = await this.partnerRepo.count({
      where: { status: 'inactive' },
    });
    return {
      totalPartners,
      activePartners,
      pendingPartners,
      inactivePartners,
    };
  }
}

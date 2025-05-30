import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner } from './entities/partner.entity';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(Partner)
    private readonly partnerRepo: Repository<Partner>,
  ) {}

  async createPartner(createPartnerDto: CreatePartnerDto): Promise<Partner> {
    const partner = this.partnerRepo.create(createPartnerDto);
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
    Object.assign(partner, updatePartnerDto);
    return this.partnerRepo.save(partner);
  }

  async deletePartner(id: number): Promise<void> {
    const partner = await this.findPartnerById(id);
    await this.partnerRepo.remove(partner);
  }
}

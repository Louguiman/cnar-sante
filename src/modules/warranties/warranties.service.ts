import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warranty } from './entities/warranty.entity';
import { CreateWarrantyDto } from './dto/create-warranty.dto';
import { UpdateWarrantyDto } from './dto/update-warranty.dto';

@Injectable()
export class WarrantiesService {
  constructor(
    @InjectRepository(Warranty)
    private readonly warrantyRepo: Repository<Warranty>,
  ) {}

  async createWarranty(
    createWarrantyDto: CreateWarrantyDto,
  ): Promise<Warranty> {
    const warranty = this.warrantyRepo.create(createWarrantyDto);
    return this.warrantyRepo.save(warranty);
  }

  async findWarrantyById(id: number): Promise<Warranty> {
    const warranty = await this.warrantyRepo.findOne({ where: { id } });
    if (!warranty) throw new NotFoundException('Warranty not found');
    return warranty;
  }

  async findAllWarranties(): Promise<Warranty[]> {
    return this.warrantyRepo.find({ relations: ["service", "category"] }); // Added relations for context
  }

  async updateWarranty(
    id: number,
    updateWarrantyDto: UpdateWarrantyDto,
  ): Promise<Warranty> {
    const warranty = await this.findWarrantyById(id);
    Object.assign(warranty, updateWarrantyDto);
    return this.warrantyRepo.save(warranty);
  }

  async deleteWarranty(id: number): Promise<void> {
    const warranty = await this.findWarrantyById(id);
    await this.warrantyRepo.remove(warranty);
  }
}

// src/modules/structures/structures.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Structure } from './entities/structure.entity';
import { CreateStructureDto } from './dto/create-structure.dto';
import { UpdateStructureDto } from './dto/update-structure.dto';

@Injectable()
export class StructuresService {
  constructor(
    @InjectRepository(Structure)
    private readonly structureRepo: Repository<Structure>,
  ) {}

  async createStructure(
    createStructureDto: CreateStructureDto,
  ): Promise<Structure> {
    const structure = this.structureRepo.create(createStructureDto);
    return this.structureRepo.save(structure);
  }

  async findStructureById(id: number): Promise<Structure> {
    const structure = await this.structureRepo.findOne({ where: { id } });
    if (!structure) throw new NotFoundException('Structure not found');
    return structure;
  }

  async updateStructure(
    id: number,
    updateStructureDto: UpdateStructureDto,
  ): Promise<Structure> {
    const structure = await this.findStructureById(id);
    Object.assign(structure, updateStructureDto);
    return this.structureRepo.save(structure);
  }

  async deleteStructure(id: number): Promise<void> {
    const structure = await this.findStructureById(id);
    await this.structureRepo.remove(structure);
  }
}

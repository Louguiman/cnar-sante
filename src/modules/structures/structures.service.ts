// src/modules/structures/structures.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, Not } from 'typeorm';
import { Structure } from './entities/structure.entity';
import { CreateStructureDto } from './dto/create-structure.dto';
import { UpdateStructureDto } from './dto/update-structure.dto';
import { User } from '../users/entities/user.entity';
import { Subscriber } from '../subscribers/entities/subscriber.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { structuresToCSV, csvToStructures } from './utils/structure-csv.util';
import { Readable } from 'stream';

@Injectable()
export class StructuresService {
  constructor(
    @InjectRepository(Structure)
    private readonly structureRepo: Repository<Structure>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Subscriber)
    private readonly subscriberRepo: Repository<Subscriber>,
  ) {}

  async createStructure(
    createStructureDto: CreateStructureDto,
  ): Promise<Structure> {
    const { userId, ...rest } = createStructureDto;
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');
    const structure = this.structureRepo.create({ ...rest, user });
    return this.structureRepo.save(structure);
  }

  async findStructureById(id: number): Promise<Structure> {
    const structure = await this.structureRepo.findOne({ where: { id } });
    if (!structure) throw new NotFoundException('Structure not found');
    return structure;
  }

  async findAllStructures(): Promise<Structure[]> {
    return this.structureRepo.find();
  }

  async updateStructure(
    id: number,
    updateStructureDto: UpdateStructureDto,
  ): Promise<Structure> {
    const structure = await this.findStructureById(id);
    const { userId, ...rest } = updateStructureDto;
    if (userId !== undefined) {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) throw new BadRequestException('User not found');
      structure.user = user;
    }
    Object.assign(structure, rest);
    return this.structureRepo.save(structure);
  }

  async deleteStructure(id: number): Promise<void> {
    const structure = await this.findStructureById(id);
    await this.structureRepo.remove(structure);
  }

  async searchStructures({
    city,
    type,
    isActive,
  }: {
    city?: string;
    type?: string;
    isActive?: boolean;
  }): Promise<Structure[]> {
    const qb = this.structureRepo.createQueryBuilder('structure');
    if (city) qb.andWhere('structure.city = :city', { city });
    if (type) qb.andWhere('structure.type = :type', { type });
    if (isActive !== undefined)
      qb.andWhere('structure.isActive = :isActive', { isActive });
    return qb.getMany();
  }

  async getStructuresByUser(userId: number): Promise<Structure[]> {
    return this.structureRepo.find({ where: { user: { id: userId } } });
  }

  async setStructureActive(id: number, isActive: boolean): Promise<Structure> {
    const structure = await this.findStructureById(id);
    structure.isActive = isActive;
    return this.structureRepo.save(structure);
  }

  async getSubscribersForStructure(id: number): Promise<Subscriber[]> {
    const structure = await this.findStructureById(id);
    return this.subscriberRepo.find({
      where: { structure: { id: structure.id } },
    });
  }

  async getUsersForStructure(id: number): Promise<User[]> {
    const structure = await this.findStructureById(id);
    return this.userRepo.find({ where: { structure: { id: structure.id } } });
  }

  async importStructures(
    csvData?: string,
  ): Promise<{ imported: number; errors: any[] }> {
    if (!csvData) return { imported: 0, errors: ['No CSV data provided'] };
    const records = csvToStructures(csvData);
    let imported = 0;
    const errors = [];
    for (const rec of records) {
      try {
        // Optionally, add user/manager assignment logic here
        const structure = this.structureRepo.create(rec);
        await this.structureRepo.save(structure);
        imported++;
      } catch (e) {
        errors.push({ record: rec, error: e.message });
      }
    }
    return { imported, errors };
  }

  async exportStructures(): Promise<{ csv: string }> {
    const structures = await this.structureRepo.find();
    const csv = structuresToCSV(structures);
    return { csv };
  }

  async getStructureStatistics(id: number): Promise<any> {
    const structure = await this.findStructureById(id);
    const subscriberCount = await this.subscriberRepo.count({
      where: { structure: { id: structure.id } },
    });
    const userCount = await this.userRepo.count({
      where: { structure: { id: structure.id } },
    });
    // More stats: active/inactive subscribers, createdAt, etc.
    const activeSubscribers = await this.subscriberRepo.count({
      where: { structure: { id: structure.id }, job: Not('') },
    });
    return {
      structureId: structure.id,
      name: structure.name,
      subscriberCount,
      userCount,
      isActive: structure.isActive,
      createdAt: structure.createdAt,
      activeSubscribers,
    };
  }

  async getGlobalStructuresStatistics(): Promise<any> {
    const totalStructures = await this.structureRepo.count();
    const activeStructures = await this.structureRepo.count({
      where: { isActive: true },
    });
    const inactiveStructures = await this.structureRepo.count({
      where: { isActive: false },
    });
    const totalSubscribers = await this.subscriberRepo.count();
    const totalUsers = await this.userRepo.count();
    // More stats: average subscribers per structure, etc.
    const avgSubscribersPerStructure = totalStructures
      ? totalSubscribers / totalStructures
      : 0;
    return {
      totalStructures,
      activeStructures,
      inactiveStructures,
      totalSubscribers,
      totalUsers,
      avgSubscribersPerStructure,
    };
  }
}

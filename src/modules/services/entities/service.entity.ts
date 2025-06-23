import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../categories/entities/category.entity';
import { Warranty } from '../../warranties/entities/warranty.entity';
import { Partner } from '../../partners/entities/partner.entity';
import { LimitType } from '../../commons/enums/limit-type.enum';

@Entity('services')
export class Service {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Consultation' })
  @Column()
  name: string;

  @ApiProperty({ type: () => Category })
  @ManyToOne(() => Category, (category) => category.services, { eager: true })
  category: Category;

  @ApiProperty({ example: 1000 })
  @Column('float', { default: 0 })
  limit: number;

  @ApiProperty({ example: 100 })
  @Column('float')
  coverageRate: number; // e.g., 100% des frais réels

  @ApiProperty({ example: 'General consultation', required: false })
  @Column({ nullable: true })
  description?: string; // Optional description of the service

  @ApiProperty({ example: 'Some notes', required: false })
  @Column({ nullable: true })
  notes?: string; // Optional notes about the service

  @ApiProperty({ example: true })
  @Column({ default: true })
  isActive: boolean; // Indicates if the service is currently active

  @ApiProperty({ example: 'SRV001', required: false })
  @Column({ nullable: true })
  code: string | null; // Optional code for the service, e.g., a unique identifier

  @ApiProperty({ example: LimitType.PER_YEAR, enum: LimitType, nullable: true })
  @Column({ type: 'enum', enum: LimitType, nullable: true })
  limitType: LimitType | null; // "per act", "per year", etc.

  @ApiProperty({ type: () => [Warranty] })
  @OneToMany(() => Warranty, (warranty) => warranty.service)
  warranties: Warranty[];

  @ApiProperty({ type: () => [Partner] })
  @ManyToMany(() => Partner, (partner) => partner.services)
  partners: Partner[];

  @CreateDateColumn()
  createdAt: Date;
}

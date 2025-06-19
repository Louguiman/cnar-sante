import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Warranty } from '../../warranties/entities/warranty.entity';
import { Partner } from '../../partners/entities/partner.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Category, (category) => category.services, { eager: true })
  category: Category;

  @Column('float')
  limit: number;

  @Column('float')
  coverageRate: number; // e.g., 100% des frais réels

  @Column({ nullable: true })
  description?: string; // Optional description of the service

  @Column({ nullable: true })
  notes?: string; // Optional notes about the service

  @Column({ default: true })
  isActive: boolean; // Indicates if the service is currently active

  @Column({ nullable: true })
  code: string | null; // Optional code for the service, e.g., a unique identifier

  @Column({ nullable: true })
  limitType: string | null; // "per act", "per year", etc.

  @OneToMany(() => Warranty, (warranty) => warranty.service)
  warranties: Warranty[];

  @OneToMany(() => Partner, (partner) => partner.service)
  partners: Partner[];

  @CreateDateColumn()
  createdAt: Date;
}

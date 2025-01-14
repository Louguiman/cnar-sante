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

  @ManyToOne(() => Category, (category) => category.services)
  category: Category;

  @OneToMany(() => Warranty, (warranty) => warranty.service)
  warranties: Warranty[];

  @OneToMany(() => Partner, (partner) => partner.service)
  partners: Partner[];

  @CreateDateColumn()
  createdAt: Date;
}

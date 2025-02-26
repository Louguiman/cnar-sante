import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Service } from '../../services/entities/service.entity';
import { Consumption } from '../../consumption/entities/consumption.entity';
import { Category } from 'src/modules/categories/entities/category.entity';

@Entity('warranties')
export class Warranty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('float')
  coverageRate: number; // 100% des frais réels

  @Column('float')
  limit: number;

  @Column({ nullable: true })
  limitType: string | null; // "per act", "per year", etc.

  @ManyToOne(() => Service, (service) => service.warranties)
  service: Service;

  @OneToMany(() => Consumption, (consumption) => consumption.warranty)
  consumptions: Consumption[];

  @ManyToOne(() => Category, (category) => category.warranties)
  category: Category;

  @CreateDateColumn()
  createdAt: Date;
}

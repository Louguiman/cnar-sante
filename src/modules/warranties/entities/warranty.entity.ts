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

@Entity('warranties')
export class Warranty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('float')
  coverage: number;

  @Column('float')
  limit: number;

  @Column()
  limitType: string;

  @ManyToOne(() => Service, (service) => service.warranties)
  service: Service;

  @OneToMany(() => Consumption, (consumption) => consumption.warranty)
  consumptions: Consumption[];

  @CreateDateColumn()
  createdAt: Date;
}

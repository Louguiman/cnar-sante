// consumption.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Card } from '../../cards/entities/card.entity';
import { Warranty } from '../../warranties/entities/warranty.entity';

@Entity('consumption')
export class Consumption {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Card, (card) => card.id)
  card: Card;

  @ManyToOne(() => Warranty, (warranty) => warranty.id)
  warranty: Warranty;

  @Column('float')
  amount: number;

  @Column('float')
  remainingBalance: number;

  @CreateDateColumn()
  createdAt: Date;
}

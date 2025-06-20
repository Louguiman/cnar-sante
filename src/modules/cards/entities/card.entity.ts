// src/modules/cards/entities/card.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Subscriber } from '../../subscribers/entities/subscriber.entity';
import { Consumption } from '../../consumption/entities/consumption.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  cardNo: string;

  @Column('date')
  createDate: Date;

  @Column('date')
  expiryDate: Date;

  @Column('float')
  balance: number;

  @Column('float')
  totalRemaining: number;

  @Column()
  status: boolean;

  @ManyToOne(() => Category, (category) => category.id, { eager: true })
  category: Category;

  @OneToMany(() => Consumption, (consumption) => consumption.card)
  consumptions: Consumption[];

  @OneToOne(() => Subscriber, (subscriber) => subscriber.card, { eager: true })
  @JoinColumn({ name: 'subscriberId' })
  subscriber: Subscriber[];

  @CreateDateColumn()
  createdAt: Date;
}

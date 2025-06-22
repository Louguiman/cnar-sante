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
import { ApiProperty } from '@nestjs/swagger';
import { Subscriber } from '../../subscribers/entities/subscriber.entity';
import { Consumption } from '../../consumption/entities/consumption.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity('cards')
export class Card {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'CARD123456' })
  @Column({ unique: true })
  cardNo: string;

  @ApiProperty({ example: '2024-01-01' })
  @CreateDateColumn()
  createDate: string;

  @ApiProperty({ example: '2025-01-01' })
  @Column('date', { nullable: true })
  expiryDate: string;

  @ApiProperty({ example: 10000 })
  @Column('float', { nullable: true })
  balance: number;

  @ApiProperty({ example: 5000 })
  @Column('float', { nullable: true })
  totalRemaining: number;

  @ApiProperty({ example: true })
  @Column({ nullable: true })
  status: boolean;

  @ApiProperty({ type: () => Category })
  @ManyToOne(() => Category, (category) => category.id, { eager: true })
  category: Category;

  @ApiProperty({ type: () => [Consumption] })
  @OneToMany(() => Consumption, (consumption) => consumption.card)
  consumptions: Consumption[];

  @ApiProperty({ type: () => Subscriber })
  @OneToOne(() => Subscriber, (subscriber) => subscriber.card, { eager: true })
  @JoinColumn({ name: 'subscriberId' })
  subscriber: Subscriber;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;
}

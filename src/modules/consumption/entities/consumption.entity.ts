// consumption.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Card } from '../../cards/entities/card.entity';
import { Warranty } from '../../warranties/entities/warranty.entity';

@Entity('consumption')
export class Consumption {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => Card })
  @ManyToOne(() => Card, (card) => card.id, { eager: true })
  card: Card;

  @ApiProperty({ type: () => Warranty })
  @ManyToOne(() => Warranty, (warranty) => warranty.id)
  warranty: Warranty;

  @ApiProperty({ example: 500 })
  @Column('float')
  amount: number;

  @ApiProperty({ example: 200 })
  @Column('float')
  remainingBalance: number;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;
}

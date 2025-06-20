// subscribers.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Card } from '../../cards/entities/card.entity';
import { Structure } from '../../structures/entities/structure.entity';

@Entity('subscribers')
export class Subscriber {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => User })
  @OneToOne(() => User, (user) => user.subscriber, { eager: true })
  @JoinColumn()
  user: User;

  @ApiProperty({ type: () => Card })
  @OneToOne(() => Card, (card) => card.id)
  @JoinColumn()
  card: Card;

  @ApiProperty({ type: () => Structure })
  @ManyToOne(() => Structure, (structure) => structure.subscribers, {
    eager: true,
  })
  structure: Structure;

  @ApiProperty({ example: '1990-01-01' })
  @Column()
  birthdate: Date;

  @ApiProperty({ example: '123 Main St' })
  @Column()
  address: string;

  @ApiProperty({ example: 'Engineer' })
  @Column()
  job: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;
}

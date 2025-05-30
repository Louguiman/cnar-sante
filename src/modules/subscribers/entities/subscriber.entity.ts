// subscribers.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Card } from '../../cards/entities/card.entity';
import { Structure } from '../../structures/entities/structure.entity';

@Entity('subscribers')
export class Subscriber {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @OneToOne(() => Card, (card) => card.id)
  card: Card;

  @OneToOne(() => Structure, (structure) => structure.id)
  structure: Structure;

  @Column()
  birthdate: Date;

  @Column()
  address: string;

  @Column()
  job: string;

  @CreateDateColumn()
  createdAt: Date;
}

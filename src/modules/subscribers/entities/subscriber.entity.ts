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
import { User } from '../../users/entities/user.entity';
import { Card } from '../../cards/entities/card.entity';
import { Structure } from '../../structures/entities/structure.entity';

@Entity('subscribers')
export class Subscriber {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(() => Card, (card) => card.id)
  card: Card;

  @OneToOne(() => Structure, (structure) => structure.id, { eager: true })
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

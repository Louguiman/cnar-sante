// src/modules/structures/entities/structure.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Subscriber } from '../../subscribers/entities/subscriber.entity';

@Entity('structures')
export class Structure {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @OneToMany(() => Subscriber, (subscriber) => subscriber.structure)
  subscribers: Subscriber[];

  @CreateDateColumn()
  createdAt: Date;
}

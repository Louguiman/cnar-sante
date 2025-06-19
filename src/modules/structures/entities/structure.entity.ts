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
  @OneToMany(() => Subscriber, (subscriber) => subscriber.structure)
  subscribers: Subscriber[];

  @Column()
  type?: string; // e.g., NGO, Foundation, Clinic, Hospital

  @Column()
  contactName?: string;

  @Column()
  contactEmail?: string;

  @Column()
  contactPhone?: string;

  @Column()
  website?: string;

  @Column()
  address?: string;

  @Column()
  city?: string;

  @Column()
  postalCode?: string;

  @Column()
  country?: string;

  @Column()
  notes?: string;

  @Column()
  fundingCapacity?: number; // Example field from implementation_plan.md

  @Column()
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

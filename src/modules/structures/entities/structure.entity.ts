// src/modules/structures/entities/structure.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Subscriber } from '../../subscribers/entities/subscriber.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('structures')
export class Structure {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'CNAR Clinic' })
  @Column()
  name: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.structure)
  user: User;

  @ApiProperty({ type: () => [Subscriber] })
  @OneToMany(() => Subscriber, (subscriber) => subscriber.structure)
  subscribers: Subscriber[];

  @ApiProperty({ type: () => [User] })
  @OneToMany(() => User, (user) => user.structure)
  users: User[];

  @ApiProperty({ example: 'Clinic', required: false })
  @Column()
  type?: string; // e.g., NGO, Foundation, Clinic, Hospital

  @ApiProperty({ example: 'Dr. Smith', required: false })
  @Column()
  contactName?: string;

  @ApiProperty({ example: 'contact@clinic.com', required: false })
  @Column()
  contactEmail?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @Column()
  contactPhone?: string;

  @ApiProperty({ example: 'www.clinic.com', required: false })
  @Column()
  website?: string;

  @ApiProperty({ example: '123 Main St', required: false })
  @Column()
  address?: string;

  @ApiProperty({ example: 'Algiers', required: false })
  @Column()
  city?: string;

  @ApiProperty({ example: '16000', required: false })
  @Column()
  postalCode?: string;

  @ApiProperty({ example: 'Algeria', required: false })
  @Column()
  country?: string;

  @ApiProperty({ example: 'Some notes about the structure', required: false })
  @Column()
  notes?: string;

  @ApiProperty({ example: 5000, required: false })
  @Column()
  fundingCapacity?: number; // Example field from implementation_plan.md

  @ApiProperty({ example: true })
  @Column()
  isActive: boolean;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}

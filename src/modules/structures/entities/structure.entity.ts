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
  @Column({ nullable: true })
  type?: string; // e.g., NGO, Foundation, Clinic, Hospital

  @ApiProperty({ example: 'Dr. Smith', required: false })
  @Column({ nullable: true })
  contactName?: string;

  @ApiProperty({ example: 'contact@clinic.com', required: false })
  @Column({ nullable: true })
  contactEmail?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @Column({ nullable: true })
  contactPhone?: string;

  @ApiProperty({ example: 'www.clinic.com', required: false })
  @Column({ nullable: true })
  website?: string;

  @ApiProperty({ example: '123 Main St', required: false })
  @Column({ nullable: true })
  address?: string;

  @ApiProperty({ example: 'Algiers', required: false })
  @Column({ nullable: true })
  city?: string;

  @ApiProperty({ example: '16000', required: false })
  @Column({ nullable: true })
  postalCode?: string;

  @ApiProperty({ example: 'Algeria', required: false })
  @Column({ nullable: true })
  country?: string;

  @ApiProperty({ example: 'Some notes about the structure', required: false })
  @Column({ nullable: true })
  notes?: string;

  @ApiProperty({ example: 5000, required: false })
  @Column({ nullable: true })
  fundingCapacity?: number; // Example field from implementation_plan.md

  @ApiProperty({ example: true })
  @Column()
  isActive: boolean;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}

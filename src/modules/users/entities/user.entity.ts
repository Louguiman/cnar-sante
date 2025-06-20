import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Subscriber } from '../../subscribers/entities/subscriber.entity';
import { Structure } from '../../structures/entities/structure.entity';
import { Partner } from '../../partners/entities/partner.entity';

@Entity('users')
@Index(['email'])
export class User {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'John Doe' })
  @Column()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 'hashedpassword' })
  @Column()
  password: string;

  @ApiProperty({ example: '+1234567890' })
  @Column()
  phone: string;

  @ApiProperty({ example: 'admin', description: 'User role' })
  @Column()
  role: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: () => Partner, required: false })
  @ManyToOne(() => Partner, (partner) => partner.users, { nullable: true })
  partner: Partner;

  @ApiProperty({ type: () => Structure, required: false })
  @ManyToOne(() => Structure, (structure) => structure.users, {
    nullable: true,
  })
  structure: Structure;

  @ApiProperty({ type: () => Subscriber, required: false })
  @OneToOne(() => Subscriber, (subscriber) => subscriber.user, {
    nullable: true,
  })
  subscriber: Subscriber;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Service } from '../../services/entities/service.entity';

@Entity('partners')
export class Partner {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Pharmacy El Amel' })
  @Column()
  name: string;

  @ApiProperty({ type: () => [Service] })
  @ManyToMany(() => Service, (service) => service.partners, { eager: true })
  @JoinTable()
  services: Service[];

  @ApiProperty({ type: () => [User] })
  @OneToMany(() => User, (user) => user.partner)
  users: User[];

  @ApiProperty({ example: 'pharmacy', required: false })
  @Column({ nullable: true })
  type: 'clinic' | 'laboratory' | 'pharmacy' | 'hospital' | 'other';

  @ApiProperty({ example: 'A pharmacy in Algiers', required: false })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({ example: 'pharmacy@email.com', required: false })
  @Column({ nullable: true })
  email?: string;

  @ApiProperty({ example: '+213123456789', required: false })
  @Column({ nullable: true })
  phone?: string;

  @ApiProperty({ example: '123 Main St', required: false })
  @Column({ nullable: true })
  address?: string;

  @ApiProperty({ example: 'Algiers', required: false })
  @Column({ nullable: true })
  city?: string;

  @ApiProperty({ example: 'Algeria', required: false })
  @Column({ nullable: true })
  country?: string;

  @ApiProperty({ example: 'Dr. Ahmed', required: false })
  @Column({ nullable: true })
  contactPerson?: string;

  @ApiProperty({ example: 'active', required: false })
  @Column({ nullable: true })
  status?: 'active' | 'pending' | 'inactive';

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;
}

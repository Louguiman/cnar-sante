import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Service } from '../../services/entities/service.entity';

@Entity('partners')
export class Partner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Service, (service) => service.id, { eager: true })
  service: Service[];

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column({ nullable: true })
  type: 'clinic' | 'laboratory' | 'pharmacy' | 'hospital' | 'other';

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  contactPerson?: string;

  @Column({ nullable: true })
  status?: 'active' | 'pending' | 'inactive';

  @Column({ nullable: true })
  contractStartDate?: string;

  @Column({ nullable: true })
  contractEndDate?: string;

  @CreateDateColumn()
  createdAt: Date;
}

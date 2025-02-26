import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Service } from '../../services/entities/service.entity';
import { Warranty } from 'src/modules/warranties/entities/warranty.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Service, (service) => service.category)
  services: Service[];

  @OneToMany(() => Warranty, (warranty) => warranty.category)
  warranties: Warranty[];

  @CreateDateColumn()
  createdAt: Date;
}

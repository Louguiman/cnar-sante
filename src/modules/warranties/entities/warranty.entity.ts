import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Service } from '../../services/entities/service.entity';
import { Consumption } from '../../consumption/entities/consumption.entity';
import { Category } from 'src/modules/categories/entities/category.entity';

@Entity('warranties')
export class Warranty {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Hospitalization' })
  @Column()
  name: string;

  @ApiProperty({ example: 100 })
  @Column('float')
  coverageRate: number;

  @ApiProperty({ example: 10000 })
  @Column('float')
  limit: number;

  @ApiProperty({ example: 'per year', nullable: true })
  @Column({ nullable: true })
  limitType: string | null;

  @ApiProperty({ type: () => Service })
  @ManyToOne(() => Service, (service) => service.warranties, { eager: true })
  service: Service;

  @ApiProperty({ type: () => [Consumption] })
  @OneToMany(() => Consumption, (consumption) => consumption.warranty)
  consumptions: Consumption[];

  @ApiProperty({ type: () => Category })
  @ManyToOne(() => Category, (category) => category.warranties, { eager: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;
}

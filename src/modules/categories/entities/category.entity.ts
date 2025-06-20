import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Service } from '../../services/entities/service.entity';
import { Warranty } from 'src/modules/warranties/entities/warranty.entity';

@Entity('categories')
export class Category {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'General Medicine' })
  @Column()
  name: string;

  @ApiProperty({ type: () => [Service] })
  @OneToMany(() => Service, (service) => service.category)
  services: Service[];

  @ApiProperty({ type: () => [Warranty] })
  @OneToMany(() => Warranty, (warranty) => warranty.category)
  warranties: Warranty[];

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;
}

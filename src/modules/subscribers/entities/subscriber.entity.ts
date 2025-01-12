import { User } from 'src/modules/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Subscriber {
  @PrimaryGeneratedColumn()
  subscriberId: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column()
  registrationNumber: string;

  @Column()
  status: string;

  @Column()
  consumption: number;
}

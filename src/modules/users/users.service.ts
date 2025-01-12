import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userDto: {
    name: string;
    email: string;
    password: string;
    role: string;
  }): Promise<User> {
    const passwordHash = await bcrypt.hash(userDto.password, 10);
    const newUser = this.usersRepository.create({ ...userDto, passwordHash });
    return this.usersRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ email });
  }

  async updateUser(id: number, updateDto): Promise<User> {
    await this.usersRepository.update(id, updateDto);
    return this.usersRepository.findOneBy({ id });
  }
}

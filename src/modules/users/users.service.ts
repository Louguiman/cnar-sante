import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAllUsers(): Promise<User[]> {
    return this.userRepo.find({});
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existantEmailUser = await this.findByEmail(createUserDto.email);
    if (existantEmailUser) {
      throw new ConflictException('A user with the same email already exists');
    }

    if (createUserDto.phone) {
      const existantUser = await this.userRepo.findOneBy({
        phone: createUserDto.phone,
      });
      if (existantUser) {
        throw new ConflictException(
          'A user with the same phone number already exists',
        );
      }
    }
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.userRepo.create({
      ...createUserDto,
      password: passwordHash,
    });
    return this.userRepo.save(newUser);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepo.findOneBy({ email });
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findUserById(id);
    Object.assign(user, updateUserDto);
    return this.userRepo.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.findUserById(id);
    await this.userRepo.remove(user);
  }
}

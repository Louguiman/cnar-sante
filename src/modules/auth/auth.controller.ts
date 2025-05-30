import { Controller, Post, Body, ConflictException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from '../../commons/decorators/public.decorator';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Role } from '../../commons/enums/role.enum';
import { PublicRegisterUserDto } from './dto/public-register-user.dto';
import { User } from '../users/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService, // Add this
  ) {}

  @Post('login')
  @Public()
  @ApiResponse({ status: HttpStatus.OK, description: 'User successfully logged in.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials.' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @Public()
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User successfully registered.', type: User }) // Assuming User entity is returned (without password)
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Email or phone already exists.' })
  async register(@Body() publicRegisterUserDto: PublicRegisterUserDto): Promise<Omit<User, 'password'>> {
    const createUserDto: CreateUserDto = {
      ...publicRegisterUserDto,
      role: Role.User, // Set default role
    };
    try {
      const user = await this.usersService.createUser(createUserDto);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      // Handle other errors or rethrow
      throw error;
    }
  }
}

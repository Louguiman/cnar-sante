// src/modules/users/dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Full name of the user' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Email address of the user' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password for the user account' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ description: 'Phone number of the user', required: false })
  @IsOptional()
  @IsPhoneNumber('ML')
  phone?: string;

  @ApiProperty({ description: 'Role of the user' })
  @IsNotEmpty()
  @IsString()
  role: string;
}

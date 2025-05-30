import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  IsOptional,
  MinLength, // Example: Add password complexity
} from 'class-validator';

export class PublicRegisterUserDto {
  @ApiProperty({ description: 'Full name of the user', example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Email address of the user', example: 'john.doe@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password for the user account (min 8 characters)',
    example: 'Str0ngP@sswOrd',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8) // Added for basic password strength
  password: string;

  @ApiProperty({
    description: 'Phone number of the user (Malian format)',
    example: '70000000',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber('ML', { message: 'Phone number must be a valid Malian phone number.' })
  phone?: string;
}

// src/modules/structures/dto/create-structure.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateStructureDto {
  @ApiProperty({ description: 'Name of the structure' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'ID of the user who manages the structure' })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'Type of the structure' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ description: 'Address of the structure' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ description: 'Contact name for the structure' })
  @IsString()
  contactName: string;

  @ApiProperty({ description: 'Contact email for the structure' })
  @IsString()
  contactEmail: string;

  @ApiProperty({ description: 'Contact phone number for the structure' })
  @IsString()
  contactPhone: string;

  @ApiProperty({ description: 'City where the structure is located' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'Postal code of the structure location' })
  @IsOptional()
  @IsString()
  postalCode: string;

  @ApiProperty({ description: 'Country where the structure is located' })
  @IsOptional()
  @IsString()
  country: string;

  @ApiProperty({
    description: 'Funding capacity of the structure',
    required: false,
  })
  @IsOptional()
  fundingCapacity?: number | null; // Optional field, can be null if not applicable

  @ApiProperty({ description: 'Website of the structure', required: false })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ description: 'Logo URL of the structure', required: false })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiProperty({ description: 'Notes about the structure', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Status of the structure', default: true })
  @IsOptional()
  @IsBoolean()
  isActive: boolean = true; // Default to true, indicating the structure is active
}

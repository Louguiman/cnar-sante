// src/modules/structures/dto/create-structure.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStructureDto {
  @ApiProperty({ description: 'Name of the structure' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Type of the structure' })
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
  @IsString()
  postalCode: string;

  @ApiProperty({ description: 'Country where the structure is located' })
  @IsString()
  country: string;

  @ApiProperty({
    description: 'Funding capacity of the structure',
    required: false,
  })
  fundingCapacity?: number | null; // Optional field, can be null if not applicable

  @ApiProperty({ description: 'Website of the structure', required: false })
  @IsString()
  website: string;

  @ApiProperty({ description: 'Logo URL of the structure', required: false })
  @IsString()
  logoUrl: string;

  @ApiProperty({ description: 'Notes about the structure', required: false })
  @IsString()
  notes: string;

  @ApiProperty({ description: 'Status of the structure', default: true })
  @IsString()
  isActive: boolean = true; // Default to true, indicating the structure is active
}

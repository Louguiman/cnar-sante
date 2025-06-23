import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ServiceIdDto {
  @ApiProperty({ description: 'Service ID' })
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

export class CreatePartnerDto {
  @ApiProperty({ description: 'Name of the partner' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'ID of the user who manages the partner' })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'Address of the partner' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ description: 'City of the partner' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ description: 'Country of the partner' })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({ description: 'Contact person at the partner' })
  @IsNotEmpty()
  @IsString()
  contactPerson: string;

  @ApiProperty({ description: 'Email of the partner', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'Phone number of the partner', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Type of the partner', required: false })
  @IsOptional()
  @IsString()
  type?: 'clinic' | 'laboratory' | 'pharmacy' | 'hospital' | 'other';

  @ApiProperty({
    description: 'Services of the partner',
    type: [ServiceIdDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceIdDto)
  services?: ServiceIdDto[];

  @ApiProperty({ description: 'Description of the partner', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Status of the partner', required: false })
  @IsOptional()
  @IsString()
  status?: 'active' | 'pending' | 'inactive';

  @ApiProperty({
    description: 'Contract start date of the partner',
    required: false,
  })
  @IsOptional()
  @IsString()
  contractStartDate?: string;

  @ApiProperty({
    description: 'Contract end date of the partner',
    required: false,
  })
  @IsOptional()
  @IsString()
  contractEndDate?: string;
}

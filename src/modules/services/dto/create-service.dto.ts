import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';
import { Warranty } from 'src/modules/warranties/entities/warranty.entity';
import { LimitType } from '../../commons/enums/limit-type.enum';

export class CreateServiceDto {
  @ApiProperty({ description: 'Name of the service' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'ID of the associated category' })
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @ApiProperty({ description: 'Limit for the service' })
  @IsNotEmpty()
  @IsNumber()
  limit: number;

  @ApiProperty({
    description: 'Type of limit (e.g., "per act", "per year")',
    required: false,
  })
  @IsString()
  limitType?: LimitType | null; // Optional, can be null if not applicable

  @ApiProperty({ description: 'Description of the service', required: false })
  @IsString()
  description?: string; // Optional field for additional information about the service

  @ApiProperty({ description: 'Code of the service', required: false })
  @IsString()
  code?: string; // Optional field for a unique code representing the service

  @ApiProperty({ description: 'Status of the service', required: false })
  @IsBoolean()
  isActive?: boolean; // Optional field to indicate the status of the service (e.g., active, inactive)

  @ApiProperty({
    description: 'Warranties associated with the service',
    type: [Warranty],
    required: false,
  })
  warranties?: Warranty[]; // Optional field to include warranties associated with the service
  // Note: Warranties can be added later, so this field is not required in the DTO
  // It can be populated after the service is created, if necessary.
}

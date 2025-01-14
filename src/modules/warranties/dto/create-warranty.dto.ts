import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateWarrantyDto {
  @ApiProperty({ description: 'Name of the warranty' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Coverage amount for the warranty' })
  @IsNotEmpty()
  @IsNumber()
  coverage: number;

  @ApiProperty({ description: 'Limit amount for the warranty' })
  @IsNotEmpty()
  @IsNumber()
  limit: number;

  @ApiProperty({ description: 'Type of limit for the warranty' })
  @IsNotEmpty()
  @IsString()
  limitType: string;

  @ApiProperty({ description: 'ID of the associated service' })
  @IsNotEmpty()
  @IsNumber()
  serviceId: number;
}

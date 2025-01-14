import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreatePartnerDto {
  @ApiProperty({ description: 'Name of the partner' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'ID of the associated service' })
  @IsNotEmpty()
  @IsNumber()
  serviceId: number;

  @ApiProperty({ description: 'ID of the user who manages the partner' })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'Address of the partner' })
  @IsNotEmpty()
  @IsString()
  address: string;
}

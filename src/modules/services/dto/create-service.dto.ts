import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ description: 'Name of the service' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'ID of the associated category' })
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}

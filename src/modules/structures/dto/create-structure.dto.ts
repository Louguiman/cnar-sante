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
}

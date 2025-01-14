// src/modules/cards/dto/create-card.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDate,
  IsBoolean,
} from 'class-validator';

export class CreateCardDto {
  @ApiProperty({ description: 'Unique card number' })
  @IsNotEmpty()
  @IsString()
  cardNo: string;

  @ApiProperty({ description: 'Card creation date' })
  @IsNotEmpty()
  @IsDate()
  createDate: Date;

  @ApiProperty({ description: 'Card expiration date' })
  @IsNotEmpty()
  @IsDate()
  expiryDate: Date;

  @ApiProperty({ description: 'Initial balance on the card' })
  @IsNotEmpty()
  @IsNumber()
  balance: number;

  @ApiProperty({ description: 'Total remaining balance' })
  @IsNotEmpty()
  @IsNumber()
  totalRemaining: number;

  @ApiProperty({ description: 'Card status (active/inactive)' })
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;

  @ApiProperty({ description: 'Category ID associated with the card' })
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}

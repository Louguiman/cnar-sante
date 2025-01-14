import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateConsumptionDto {
  @ApiProperty({ description: 'ID of the associated card' })
  @IsNotEmpty()
  @IsNumber()
  cardId: number;

  @ApiProperty({ description: 'ID of the associated warranty' })
  @IsNotEmpty()
  @IsNumber()
  warrantyId: number;

  @ApiProperty({ description: 'Amount of the transaction' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Remaining balance on the card after the transaction',
  })
  @IsNotEmpty()
  @IsNumber()
  remainingBalance: number;
}

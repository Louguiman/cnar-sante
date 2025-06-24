import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class TrackConsumptionDto {
  @ApiProperty({ example: '1234567890' })
  @IsNumber()
  cardNo: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  warrantyId: number;

  @ApiProperty({ example: 500 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  serviceId: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  partnerId?: number;
}

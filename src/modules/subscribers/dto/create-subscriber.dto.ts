import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateSubscriberDto {
  @ApiProperty({ description: 'ID of the associated user' })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiPropertyOptional({ description: 'ID of the associated card' })
  @IsOptional()
  @IsNumber()
  cardId: number;

  @ApiProperty({ description: 'ID of the associated structure' })
  @IsNotEmpty()
  @IsNumber()
  structureId: number;

  @ApiProperty({ description: "Subscriber's birthdate" })
  @IsNotEmpty()
  @IsString()
  birthdate: Date;

  @ApiProperty({ description: "Subscriber's address" })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ description: "Subscriber's job", required: false })
  @IsOptional()
  @IsString()
  job?: string;
}

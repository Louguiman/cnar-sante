// src/modules/cards/cards.controller.ts
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from './entities/card.entity';
import { JwtAuthGuard } from 'src/commons/guards/jwt.guard';
import { RolesGuard } from 'src/commons/guards/roles.guard';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { Role } from 'src/commons/enums/role.enum';

@ApiTags('Cards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @Roles(Role.Admin)
  @ApiResponse({ status: 201, description: 'Card successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  createCard(@Body() createCardDto: CreateCardDto): Promise<Card> {
    return this.cardsService.createCard(createCardDto);
  }

  @Get()
  getAllCards(@Query('structureId') structureId?: number): Promise<Card[]> {
    if (structureId) {
      return this.cardsService.findCardsByStructure(structureId);
    }
    return this.cardsService.findAllCards();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Card successfully retrieved.' })
  @ApiResponse({ status: 404, description: 'Card not found.' })
  getCard(@Param('id') id: number): Promise<Card> {
    return this.cardsService.findCardById(id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @ApiResponse({ status: 200, description: 'Card successfully updated.' })
  @ApiResponse({ status: 404, description: 'Card not found.' })
  updateCard(
    @Param('id') id: number,
    @Body() updateCardDto: UpdateCardDto,
  ): Promise<Card> {
    return this.cardsService.updateCard(id, updateCardDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @ApiResponse({ status: 200, description: 'Card successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Card not found.' })
  deleteCard(@Param('id') id: number): Promise<void> {
    return this.cardsService.deleteCard(id);
  }

  @Patch(':id/recharge')
  @Roles(Role.Admin)
  @ApiResponse({ status: 200, description: 'Card successfully recharged.' })
  @ApiResponse({ status: 404, description: 'Card not found.' })
  rechargeCard(
    @Param('id') id: number,
    @Query('amount') amount: number,
  ): Promise<Card> {
    return this.cardsService.rechargeCard(id, amount);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { CreateCardTypeDto } from './dto/create-card-type.dto';
import { UpdateCardTypeDto } from './dto/update-card-type.dto';
import { CardType } from './entities/card-type.entity';
import { CardTypeNotFoundException } from './errors/card-type-not-found.exception';

@Injectable()
export class CardTypesService {
  constructor(@InjectRepository(CardType) private readonly cardTypesRepository: Repository<CardType>) {}

  async paginate({perPage, offset}: PaginationOptions): Promise<PaginationResult<CardType>> {
    const [cardTypes, total] = await this.cardTypesRepository.findAndCount({
      take: perPage,
      skip: offset,
    });

    return new PaginationResult(cardTypes, total, perPage);
  }

  async create(createCardTypeDto: CreateCardTypeDto): Promise<CardType> {
    const cardType = CardType.create(createCardTypeDto);

    return await this.cardTypesRepository.save(cardType);
  }

  async findOne(id: number): Promise<CardType> {
    const cardType = await this.cardTypesRepository.findOne(id);

    if (!cardType) {
      throw new CardTypeNotFoundException();
    }

    return cardType;
  }

  async update({id, ...updateCardTypeDto}: UpdateCardTypeDto): Promise<CardType> {
    const cardType = await this.findOne(+id);

    Object.assign(cardType, updateCardTypeDto);

    return await this.cardTypesRepository.save(cardType);
  }

  async delete(id: number): Promise<void> {
    const cardType = await this.findOne(id);

    await this.cardTypesRepository.softRemove(cardType);
  }
}

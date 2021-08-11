import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { CardIssuerType } from './entities/card-issuer-type.entity';
import { CreateCardIssuerTypeDto } from './dto/create-card-issuer-type.dto';
import { CardIssuerTypeNotFoundException } from './errors/card-issuer-type-not-found.exception';
import { UpdateCardIssuerTypeDto } from './dto/update-card-issuer-type.dto';

@Injectable()
export class CardIssuerTypesService {
  constructor(@InjectRepository(CardIssuerType) private readonly cardIssuerTypesRepository: Repository<CardIssuerType>) {}

  async paginate({offset, perPage}: PaginationOptions): Promise<PaginationResult<CardIssuerType>> {
    const [cardIssuerTypes, total] = await this.cardIssuerTypesRepository.findAndCount({
      take: perPage,
      skip: offset,
    });

    return new PaginationResult(cardIssuerTypes, total, perPage);
  }

  async create(createCardIssuerTypeDto: CreateCardIssuerTypeDto): Promise<CardIssuerType> {
    const cardIssuerType = CardIssuerType.create(createCardIssuerTypeDto);

    return await this.cardIssuerTypesRepository.save(cardIssuerType);
  }

  async findOne(id: number): Promise<CardIssuerType> {
    const cardIssuerType = await this.cardIssuerTypesRepository.findOne(id);

    if (!cardIssuerType) {
      throw new CardIssuerTypeNotFoundException();
    }

    return cardIssuerType;
  }

  async update({id, ...updateCardIssuerTypeDto}: UpdateCardIssuerTypeDto): Promise<CardIssuerType> {
    const cardIssuerType = await this.findOne(id);

    Object.assign(cardIssuerType, updateCardIssuerTypeDto);

    return this.cardIssuerTypesRepository.save(cardIssuerType);
  }

  async delete(id: number): Promise<void> {
    const cardIssuerType = await this.findOne(id);

    await this.cardIssuerTypesRepository.softRemove(cardIssuerType);
  }
}

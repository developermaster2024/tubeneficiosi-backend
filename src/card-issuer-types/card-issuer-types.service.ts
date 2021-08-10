import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { CardIssuerType } from './entities/card-issuer-type.entity';

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
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { DiscountType } from './entities/discount-type.entity';

@Injectable()
export class DiscountTypesService {
  constructor(@InjectRepository(DiscountType) private readonly discountTypesRepository: Repository<DiscountType>) {}

  async paginate({perPage, offset}: PaginationOptions): Promise<PaginationResult<DiscountType>> {
    const queryBuilder = this.discountTypesRepository.createQueryBuilder('discountType')
      .take(perPage)
      .skip(offset);

    const [discountTypes, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(discountTypes, total, perPage);
  }
}

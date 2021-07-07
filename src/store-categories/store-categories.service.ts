import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { StoreCategory } from './entities/store-category.entity';

@Injectable()
export class StoreCategoriesService {
  constructor(@InjectRepository(StoreCategory) private readonly storeCategoriesRepository: Repository<StoreCategory>) {}

  async paginate({offset, perPage}: PaginationOptions): Promise<PaginationResult<StoreCategory>> {
    const [storeCategories, total] = await this.storeCategoriesRepository.findAndCount({
      take: perPage,
      skip: offset,
    });

    return new PaginationResult(storeCategories, total, perPage);
  }
}

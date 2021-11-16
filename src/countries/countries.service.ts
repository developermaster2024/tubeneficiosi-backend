import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';

@Injectable()
export class CountriesService {
  constructor(@InjectRepository(Country) private readonly countriesRepository: Repository<Country>) {}

  async paginate({perPage, offset}: PaginationOptions): Promise<PaginationResult<Country>> {
    const queryBuilder = this.countriesRepository.createQueryBuilder('country')
      .take(perPage)
      .skip(offset)
      .orderBy('country.name', 'ASC');

    const [countries, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(countries, total, perPage);
  }
}

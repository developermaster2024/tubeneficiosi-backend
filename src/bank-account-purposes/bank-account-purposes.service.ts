import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { BankAccountPurpose } from './entities/bank-account-purpose.entity';

@Injectable()
export class BankAccountPurposesService {
  constructor(@InjectRepository(BankAccountPurpose) private readonly bankAccountPurposesRepository: Repository<BankAccountPurpose>) {}

  async paginate({offset, perPage}: PaginationOptions): Promise<PaginationResult<BankAccountPurpose>> {
    const [bankAccountPurposes, total] = await this.bankAccountPurposesRepository.findAndCount({
      take: perPage,
      skip: offset,
    });

    return new PaginationResult(bankAccountPurposes, total, perPage);
  }
}

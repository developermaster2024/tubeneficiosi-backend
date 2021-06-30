import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { CreateBankAccountTypeDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountTypeDto } from './dto/update-bank-account.dto';
import { BankAccountType } from './entities/bank-account-type.entity';
import { BankAccountTypeNotFound } from './errors/bank-account-type-not-found.exception';

@Injectable()
export class BankAccountTypesService {
  constructor(@InjectRepository(BankAccountType) private readonly bankAccountTypesRepository: Repository<BankAccountType>) {}

  async paginate({offset, perPage}: PaginationOptions): Promise<PaginationResult<BankAccountType>> {
    const [bankAccountTypes, total] = await this.bankAccountTypesRepository.findAndCount({
      take: perPage,
      skip: offset,
    });

    return new PaginationResult(bankAccountTypes, total, perPage);
  }

  async create(createBankAccountTypeDto: CreateBankAccountTypeDto): Promise<BankAccountType> {
    const bankAccountType = BankAccountType.create(createBankAccountTypeDto);

    return await this.bankAccountTypesRepository.save(bankAccountType);
  }

  async findOne(id: number): Promise<BankAccountType> {
    const bankAccountType = await this.bankAccountTypesRepository.findOne(id);

    if (!bankAccountType) {
      throw new BankAccountTypeNotFound();
    }

    return bankAccountType;
  }

  async update({id, ...updateBankAccountTypeDto}: UpdateBankAccountTypeDto): Promise<BankAccountType> {
    const bankAccountType = await this.findOne(+id);

    Object.assign(bankAccountType, updateBankAccountTypeDto);

    return await this.bankAccountTypesRepository.save(bankAccountType);
  }

  async delete(id: number): Promise<void> {
    const bankAccountType = await this.findOne(id);

    await this.bankAccountTypesRepository.softRemove(bankAccountType);
  }
}

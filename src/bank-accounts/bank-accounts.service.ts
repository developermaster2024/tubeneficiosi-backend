import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { BankAccount } from './entities/bank-account.entity';
import { BankAccountNotFoundException } from './errors/bank-account-not-found.exception';

@Injectable()
export class BankAccountsService {
  constructor(@InjectRepository(BankAccount) private readonly bankAccountsRepository: Repository<BankAccount>) {}

  async paginate({offset, perPage}: PaginationOptions): Promise<PaginationResult<BankAccount>> {
    const [bankAccounts, total] = await this.bankAccountsRepository.findAndCount({
      take: perPage,
      skip: offset,
      relations: ['cardIssuer', 'bankAccountType'],
    });

    return new PaginationResult(bankAccounts, total, perPage);
  }

  async create(createBankAccountDto: CreateBankAccountDto): Promise<BankAccount> {
    const bankAccount = BankAccount.create(createBankAccountDto);

    return await this.bankAccountsRepository.save(bankAccount);
  }

  async findOne(id: number): Promise<BankAccount> {
    const bankAccount = await this.bankAccountsRepository.findOne({
      where: {id},
      relations: ['cardIssuer', 'bankAccountType'],
    });

    if (!bankAccount) {
      throw new BankAccountNotFoundException();
    }

    return bankAccount;
  }

  async update({id, ...udpateBankAccountDto}: UpdateBankAccountDto): Promise<BankAccount> {
    const bankAccount = await this.findOne(+id);

    Object.assign(bankAccount, udpateBankAccountDto);

    return await this.bankAccountsRepository.save(bankAccount);
  }

  async delete(id: number): Promise<void> {
    const bankAccount = await this.findOne(+id);

    await this.bankAccountsRepository.softRemove(bankAccount);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { BankAccountPaginationOptionsDto } from './dto/bank-account-pagination-options.dto';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { BankAccount } from './entities/bank-account.entity';
import { BankAccountNotFoundException } from './errors/bank-account-not-found.exception';

@Injectable()
export class BankAccountsService {
  constructor(@InjectRepository(BankAccount) private readonly bankAccountsRepository: Repository<BankAccount>) {}

  async paginate({offset, perPage, filters: {
    id,
    alias,
    accountNumber,
    bankAccountTypeId,
    bankAccountTypeName,
    cbu,
    cardIssuerName,
    cardIssuerIds,
    branchOffice,
    paymentMethodCode,
  }}: BankAccountPaginationOptionsDto): Promise<PaginationResult<BankAccount>> {
    const queryBuilder = this.bankAccountsRepository.createQueryBuilder('bankAccount')
      .leftJoinAndSelect('bankAccount.bankAccountType', 'bankAccountType')
      .leftJoinAndSelect('bankAccount.cardIssuer', 'cardIssuer')
      .leftJoinAndSelect('bankAccount.paymentMethod', 'paymentMethod')
      .take(perPage)
      .skip(offset);

    if (id) queryBuilder.andWhere('bankAccount.id = :id', { id });

    if (alias) queryBuilder.andWhere('bankAccount.alias LIKE :alias', { alias: `%${alias}%` });

    if (accountNumber) queryBuilder.andWhere('bankAccount.accountNumber LIKE :accountNumber', { accountNumber: `%${accountNumber}%` });

    if (bankAccountTypeId) queryBuilder.andWhere('bankAccount.bankAccountTypeId = :bankAccountTypeId', { bankAccountTypeId });

    if (bankAccountTypeName) queryBuilder.andWhere('bankAccountType.name LIKE :bankAccountTypeName', { bankAccountTypeName: `%${bankAccountTypeName}%` });

    if (cbu) queryBuilder.andWhere('bankAccount.cbu LIKE :cbu', { cbu: `%${cbu}%` });

    if (cardIssuerName) queryBuilder.andWhere('cardIssuer.name LIKE :cardIssuerName', { cardIssuerName: `%${cardIssuerName}%` });

    if (cardIssuerIds.length > 0) queryBuilder.andWhere('cardIssuer.id IN (:...cardIssuerIds)', { cardIssuerIds });

    if (branchOffice) queryBuilder.andWhere('bankAccount.branchOffice LIKE :branchOffice', { branchOffice: `%${branchOffice}%` });

    if (paymentMethodCode) queryBuilder.andWhere('paymentMethod.code = :paymentMethodCode', { paymentMethodCode });

    const [bankAccounts, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(bankAccounts, total, perPage);
  }

  async create(createBankAccountDto: CreateBankAccountDto): Promise<BankAccount> {
    const bankAccount = BankAccount.create(createBankAccountDto);

    return await this.bankAccountsRepository.save(bankAccount);
  }

  async findOne(id: number): Promise<BankAccount> {
    const bankAccount = await this.bankAccountsRepository.findOne({
      where: {id},
      relations: ['cardIssuer', 'bankAccountType', 'paymentMethod'],
    });

    if (!bankAccount) {
      throw new BankAccountNotFoundException();
    }

    return bankAccount;
  }

  async update({id, ...udpateBankAccountDto}: UpdateBankAccountDto): Promise<BankAccount> {
    const bankAccount = await this.bankAccountsRepository.findOne(+id);

    if (!bankAccount) {
      throw new BankAccountNotFoundException();
    }

    Object.assign(bankAccount, udpateBankAccountDto);

    return await this.bankAccountsRepository.save(bankAccount);
  }

  async delete(id: number): Promise<void> {
    const bankAccount = await this.findOne(+id);

    await this.bankAccountsRepository.softRemove(bankAccount);
  }
}

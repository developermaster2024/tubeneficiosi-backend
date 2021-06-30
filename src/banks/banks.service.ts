import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { FindConditions, Like, Repository } from 'typeorm';
import { BankPaginationOptionsDto } from './dto/bank-pagination-options.dto';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { Bank } from './entities/bank.entity';
import { BankNotFoundException } from './errors/bank-not-found.exception';

@Injectable()
export class BanksService {
  constructor(@InjectRepository(Bank) private readonly banksRepository: Repository<Bank>) {}

  async paginate({offset, perPage, filters}: BankPaginationOptionsDto): Promise<PaginationResult<Bank>> {
    const where: FindConditions<Bank> = {};

    // @ts-ignore
    if (filters.id) where.id = +filters.id;

    if (filters.name) where.name = Like(`%${filters.name}%`);

    const [banks, total] = await this.banksRepository.findAndCount({
      take: perPage,
      skip: offset,
      where,
    });

    return new PaginationResult(banks, total, perPage);
  }

  async create({image, ...createBankDto}: CreateBankDto): Promise<Bank> {
    const bank = Bank.create({
      ...createBankDto,
      imgPath: image.path,
    });

    return await this.banksRepository.save(bank);
  }

  async findOne(id: number): Promise<Bank> {
    const bank = await this.banksRepository.findOne(id);

    if (!bank) {
      throw new BankNotFoundException();
    }

    return bank;
  }

  async update({id, image, ...updateBankDto}: UpdateBankDto): Promise<Bank> {
    const bank = await this.findOne(+id);

    Object.assign(bank, updateBankDto);

    if (image) bank.imgPath = image.path;

    return await this.banksRepository.save(bank);
  }

  async delete(id: number): Promise<void> {
    const bank = await this.findOne(id);

    await this.banksRepository.softRemove(bank);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { FindConditions, Like, Repository } from 'typeorm';
import { CreateHelpDto } from './dto/create-help.dto';
import { HelpPaginationOptionsDto } from './dto/help-pagination-options.dto';
import { UpdateHelpDto } from './dto/update-help.dto';
import { Help } from './entities/help.entity';
import { HelpNotFoundException } from './errors/help-not-found.exception';

@Injectable()
export class HelpsService {
  constructor(@InjectRepository(Help) private readonly helpsRepository: Repository<Help>) {}

  async paginate({offset, perPage, filters}: HelpPaginationOptionsDto): Promise<PaginationResult<Help>> {
    const where: FindConditions<Help> = {};

    // @ts-ignore
    if (filters.id) where.id = filters.id;

    if (filters.title) where.title = Like(`%${filters.title}%`);

    if (filters.categoryId) where.helpCategoryId = +filters.categoryId;

    const [helps, total] = await this.helpsRepository.findAndCount({
      take: perPage,
      skip: offset,
      where
    });

    return new PaginationResult(helps, total, perPage);
  }

  async create(createHelpDto: CreateHelpDto): Promise<Help> {
    const help = Help.create(createHelpDto);

    return await this.helpsRepository.save(help);
  }

  async findOne(id: number): Promise<Help> {
    const help = await this.helpsRepository.findOne(id);

    if (!help) {
      throw new HelpNotFoundException();
    }

    return help;
  }

  async update({id, ...updateHelpDto}: UpdateHelpDto): Promise<Help> {
    const help = await this.findOne(id);

    Object.assign(help, updateHelpDto);

    return await this.helpsRepository.save(help);
  }

  async delete(id: number): Promise<void> {
    const help = await this.findOne(id);

    await this.helpsRepository.softRemove(help);
  }
}

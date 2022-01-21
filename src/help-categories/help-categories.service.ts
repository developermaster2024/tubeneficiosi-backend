import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { FindConditions, Like, Repository } from 'typeorm';
import { CreateHelpCategoryDto } from './dto/create-help-category.dto';
import { HelpCategoryPaginationOptionsDto } from './dto/help-category-pagination-options.dto';
import { UpdateHelpCategoryDto } from './dto/update-help-category.dto';
import { HelpCategory } from './entities/help-category.entity';
import { HelpCategoryNotFoundException } from './errors/help-category-not-found.exception';

@Injectable()
export class HelpCategoriesService {
  constructor(@InjectRepository(HelpCategory) private readonly helpCategoriesRepository: Repository<HelpCategory>) {}

  async paginate({offset, perPage, filters}: HelpCategoryPaginationOptionsDto): Promise<PaginationResult<HelpCategory>> {
    const where: FindConditions<HelpCategory> = {};

    // @ts-ignore
    if (filters.id) where.id = +filters.id;

    if (filters.name) where.name = Like(`%${filters.name}%`);

    const [helpCategories, total] = await this.helpCategoriesRepository.findAndCount({
      take: perPage,
      skip: offset,
      where,
    });

    return new PaginationResult(helpCategories, total, perPage);
  }

  async create({icon, ...createHelpCategoryDto}: CreateHelpCategoryDto): Promise<HelpCategory> {
    const helpCategory = HelpCategory.create({
      ...createHelpCategoryDto,
      icon: icon.path,
    });

    return await this.helpCategoriesRepository.save(helpCategory);
  }

  async findOne(id: number): Promise<HelpCategory> {
    const helpCategory = await this.helpCategoriesRepository.findOne(id);

    if (!helpCategory) {
      throw new HelpCategoryNotFoundException();
    }

    return helpCategory;
  }

  async update({id, icon, name}: UpdateHelpCategoryDto): Promise<HelpCategory> {
    const helpCategory = await this.findOne(id);

    Object.assign(helpCategory, {name});

    if (icon) {
      helpCategory.icon = icon.path;
    }

    return await this.helpCategoriesRepository.save(helpCategory);
  }

  async delete(id: number): Promise<void> {
    const helpCategory = await this.findOne(id);

    await this.helpCategoriesRepository.softRemove(helpCategory);
  }
}

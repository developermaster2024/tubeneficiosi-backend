import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/stores/entities/store.entity';
import { StoreNotFoundException } from 'src/stores/erros/store-not-found.exception';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { In, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { CategoryNotFoundException } from './errors/category-not-found.exception';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Store) private readonly storesRepository: Repository<Store>,
    @InjectRepository(Category) private readonly categoriesRepository: Repository<Category>
  ) {}

  async paginate(options: PaginationOptions, userId: number): Promise<PaginationResult<Category>> {
    const store = await this.findStoreByUserId(userId);

    const [categories, total] = await this.categoriesRepository.findAndCount({
      take: options.perPage,
      skip: options.offset,
      where: {store: store}
    });

    return new PaginationResult(categories, total, options.perPage);
  }

  async create({parentIds, userId, name}: CreateCategoryDto): Promise<Category> {
    const store = await this.findStoreByUserId(userId);

    const parentCategories = parentIds.length === 0 ? [] : await this.categoriesRepository.find({
      where: {id: In(parentIds)}
    });

    const category = Category.create({name, store, parentCategories});

    return await this.categoriesRepository.save(category);
  }

  async findStoreByUserId(userId: number): Promise<Store> {
    const store = await this.storesRepository.findOne({user: {id: userId}});

    if (!store) {
      throw new StoreNotFoundException();
    }

    return store;
  }

  async findOne(id: number, userId: number): Promise<Category> {
    const store = await this.findStoreByUserId(userId);

    const category = await this.categoriesRepository.findOne({id, store});

    if (!category) {
      throw new CategoryNotFoundException();
    }

    return category;
  }

  async udpate({id, userId, parentIds, name}: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id, userId);

    const parentCategories = parentIds.length === 0 ? [] : await this.categoriesRepository.find({
      where: {id: In(parentIds)}
    });

    Object.assign(category, {name, parentCategories});

    return await this.categoriesRepository.save(category);
  }

  async delete(id: number, userId: number): Promise<void> {
    const category = await this.findOne(id, userId);

    await this.categoriesRepository.softRemove(category);
  }
}

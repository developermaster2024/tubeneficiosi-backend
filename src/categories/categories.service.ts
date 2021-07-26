import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/stores/entities/store.entity';
import { StoreNotFoundException } from 'src/stores/erros/store-not-found.exception';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { FindConditions, In, Like, Repository } from 'typeorm';
import { CategoryPaginationOptionsDto } from './dto/category-pagination-options.dto';
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

  async paginate({perPage, offset, filters}: CategoryPaginationOptionsDto): Promise<PaginationResult<Category>> {
    const queryBuilder = this.categoriesRepository.createQueryBuilder('category')
      .take(perPage)
      .skip(offset)
      .innerJoin('category.store', 'store');

    if (filters.id) queryBuilder.andWhere('category.id = :id', {id: filters.id});

    if (filters.name) queryBuilder.andWhere('category.name LIKE :name', {name: `%${filters.name}%`});

    if (filters.storeId) queryBuilder.andWhere('store.id = :storeId', {storeId: filters.storeId});

    if (filters.parentOnly) queryBuilder.andWhere('category.parentId IS NULL');

    if (filters.parentId) queryBuilder.andWhere('category.parentId = :parentId', {parentId: filters.parentId});

    const [categories, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(categories, total, perPage);
  }

  async create({userId, ...createCategoryDto}: CreateCategoryDto): Promise<Category> {
    const store = await this.findStoreByUserId(userId);

    const category = Category.create({...createCategoryDto, store});

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

  async udpate({id, userId, ...updateCategoryDto}: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id, userId);

    Object.assign(category, {...updateCategoryDto});

    return await this.categoriesRepository.save(category);
  }

  async delete(id: number, userId: number): Promise<void> {
    const category = await this.findOne(id, userId);

    await this.categoriesRepository.softRemove(category);
  }
}

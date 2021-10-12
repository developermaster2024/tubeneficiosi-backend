import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { CreateStoreFeatureDto } from './dto/create-store-feature.dto';
import { StoreFeaturePaginationOptionsDto } from './dto/store-feature-pagination-options.dto';
import { UpdateStoreFeatureDto } from './dto/update-store-feature.dto';
import { StoreFeature } from './entities/store-feature.entity';
import { StoreFeatureNotFoundException } from './errors/store-feature-not-found.exception';

@Injectable()
export class StoreFeaturesService {
  constructor(@InjectRepository(StoreFeature) private readonly storeFeaturesRepository: Repository<StoreFeature>) {}

  async paginate({perPage, offset, filters: {
    id,
    name,
    storeCategoryIds,
  }}: StoreFeaturePaginationOptionsDto): Promise<PaginationResult<StoreFeature>> {
    const queryBuilder = this.storeFeaturesRepository.createQueryBuilder('storeFeature')
      .innerJoinAndSelect('storeFeature.storeCategory', 'storeCategory')
      .take(perPage)
      .skip(offset);

    if (id) queryBuilder.andWhere('storeFeature.id = :id', { id });

    if (name) queryBuilder.andWhere('storeFeature.name LIKE :name', { name: `%${name}%` });

    if (storeCategoryIds.length > 0) queryBuilder.andWhere('storeFeature.storeCategoryId IN (:...storeCategoryIds)', { storeCategoryIds });

    const [storeFeatures, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(storeFeatures, total, perPage);
  }

  async create(createStoreFeatureDto: CreateStoreFeatureDto): Promise<StoreFeature> {
    const storeFeature = StoreFeature.create(createStoreFeatureDto);

    return await this.storeFeaturesRepository.save(storeFeature);
  }

  async findOne(id: number): Promise<StoreFeature> {
    const storeFeature = await this.storeFeaturesRepository.createQueryBuilder('storeFeature')
      .innerJoinAndSelect('storeFeature.storeCategory', 'storeCategory')
      .where('storeFeature.id = :id', { id })
      .getOne();

    if (!storeFeature) {
      throw new StoreFeatureNotFoundException();
    }

    return storeFeature;
  }

  async update({id, ...updateStoreFeatureDto}: UpdateStoreFeatureDto): Promise<StoreFeature> {
    const storeFeature = await this.storeFeaturesRepository.createQueryBuilder('storeFeature')
      .where('storeFeature.id = :id', { id })
      .getOne();

    if (!storeFeature) throw new StoreFeatureNotFoundException();

    Object.assign(storeFeature, updateStoreFeatureDto);

    return await this.storeFeaturesRepository.save(storeFeature);
  }

  async delete(id: number): Promise<void> {
    const storeFeature = await this.storeFeaturesRepository.createQueryBuilder('storeFeature')
      .where('storeFeature.id = :id', { id })
      .getOne();

    if (!storeFeature) throw new StoreFeatureNotFoundException();

    await this.storeFeaturesRepository.remove(storeFeature);
  }
}

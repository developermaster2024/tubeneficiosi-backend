import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { CreateStoreAdDto } from './dto/create-store-ad.dto';
import { StoreAdPaginationOptionsDto } from './dto/store-ad-pagination-options.dto';
import { UpdateStoreAdDto } from './dto/update-store-ad.dto';
import { StoreAd } from './entities/store-ad.entity';
import { StoreAdNotFoundException } from './errors/store-ad-not-found.exception';

@Injectable()
export class StoreAdsService {
  constructor(@InjectRepository(StoreAd) private readonly storeAdsRepository: Repository<StoreAd>) {}

  async paginate({perPage, offset, filters: {
    id,
    priority,
    storeName,
    minDate,
    maxDate,
    minPrice,
    maxPrice,
    isActive,
  }}: StoreAdPaginationOptionsDto): Promise<PaginationResult<StoreAd>> {
    const queryBuilder = this.storeAdsRepository.createQueryBuilder('storeAd')
      .leftJoinAndSelect('storeAd.store', 'store')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile')
      .leftJoinAndSelect('store.products', 'product')
      .leftJoinAndSelect('store.storeHours', 'storeHour')
      .leftJoinAndSelect('product.productImages', 'productImage')
      .take(perPage)
      .skip(offset);

    if (id) queryBuilder.andWhere('storeAd.id = :id', { id });

    if (priority) queryBuilder.andWhere('storeAd.priority LIKE :priority', { priority });

    if (storeName) queryBuilder.andWhere('store.name LIKE :storeName', { storeName: `%${storeName}%` });

    if (minDate) queryBuilder.andWhere('storeAd.from >= :minDate', { minDate });

    if (maxDate) queryBuilder.andWhere('storeAd.until <= :maxDate', { maxDate });

    if (minPrice) queryBuilder.andWhere('storeAd.price >= :minPrice', { minPrice });

    if (maxPrice) queryBuilder.andWhere('storeAd.price <= :maxPrice', { maxPrice });

    if (isActive !== null) {
      const condition = isActive
        ? 'storeAd.from <= :today AND storeAd.until >= :today'
        : 'storeAd.from >= :today OR storeAd.until <= :today';

      queryBuilder.andWhere(condition, { today: new Date() });
    }

    const [storeAds, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(storeAds, total, perPage);
  }

  async create(createStoreAdDto: CreateStoreAdDto): Promise<StoreAd> {
    const storeAd = StoreAd.create(createStoreAdDto);

    return await this.storeAdsRepository.save(storeAd);
  }

  async findOne(id: number): Promise<StoreAd> {
    const storeAd = await this.storeAdsRepository.findOne({
      where: {id},
      relations: ['store', 'store.storeProfile', 'store.products'],
    });

    if (!storeAd) {
      throw new StoreAdNotFoundException();
    }

    return storeAd;
  }

  async update({id, ...updateStoreAdDto}: UpdateStoreAdDto): Promise<StoreAd> {
    const storeAd = await this.findOne(+id);

    Object.assign(storeAd, updateStoreAdDto);

    return await this.storeAdsRepository.save(storeAd);
  }

  async delete(id: number): Promise<void> {
    const storeAd = await this.findOne(id);

    await this.storeAdsRepository.softRemove(storeAd);
  }
}

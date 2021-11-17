import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { CreateFeaturedAdDto } from './dto/create-featured-ad.dto';
import { FeaturedAdPaginationOptionsDto } from './dto/featured-ad-pagination-options.dto';
import { UpdateFeaturedAdDto } from './dto/update-featured-ad.dto';
import { FeaturedAd } from './entities/featured-ad.entity';
import { FeaturedAdNotFoundException } from './errors/featured-ad-not-found.exception';

@Injectable()
export class FeaturedAdsService {
  constructor(@InjectRepository(FeaturedAd) private readonly featuredAdsRepository: Repository<FeaturedAd>) {}

  async paginate({offset, perPage, filters: {
    id,
    priority,
    productName,
    storeName,
    storeCategoryId,
    minDate,
    maxDate,
    minPrice,
    maxPrice,
    isActive,
  }}: FeaturedAdPaginationOptionsDto): Promise<PaginationResult<FeaturedAd>> {
    const queryBuilder = this.featuredAdsRepository.createQueryBuilder('featuredAd')
      .take(perPage)
      .skip(offset)
      .leftJoinAndSelect('featuredAd.product', 'product')
      .leftJoinAndSelect('featuredAd.storeCategory', 'storeCategory')
      .leftJoinAndSelect('product.productImages', 'productImage')
      .leftJoinAndSelect('product.productFeatures', 'productFeature')
      .leftJoinAndSelect('product.productFeatureGroups', 'productFeatureGroup')
      .leftJoinAndSelect('productFeatureGroup.productFeatureForGroups', 'productFeatureForGroup')
      .leftJoinAndSelect('product.productDetails', 'productDetails')
      .leftJoinAndSelect('product.showDetails', 'showDetails')
      .leftJoinAndSelect('product.shows', 'show', 'show.date >= :today', { today: new Date() })
      .leftJoinAndSelect('show.showToZones', 'showToZone')
      .leftJoinAndSelect('showToZone.zone', 'zone')
      .leftJoinAndSelect('show.place', 'place')
      .leftJoinAndSelect('product.store', 'store')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile')
      .leftJoinAndSelect('store.storeHours', 'storeHour')
      .leftJoinAndMapOne(
        'store.latestActiveDiscount',
        'store.discounts',
        'latestActiveDiscount',
        'latestActiveDiscount.from <= :today AND latestActiveDiscount.until >= :today'
      , { today: new Date() });

    if (id) queryBuilder.andWhere('featuredAd.id = :id', { id });

    if (priority) queryBuilder.andWhere('featuredAd.priority LIKE :priority', { priority });

    if (productName) queryBuilder.andWhere('product.name LIKE :productName', { productName: `%${productName}%` });

    if (storeName) queryBuilder.andWhere('store.name LIKE :storeName', { storeName: `%${storeName}%` });

    if (storeCategoryId) queryBuilder.andWhere('store.storeCategoryId = :storeCategoryId', { storeCategoryId });

    if (minDate) queryBuilder.andWhere('featuredAd.from >= :minDate', { minDate });

    if (maxDate) queryBuilder.andWhere('featuredAd.until <= :maxDate', { maxDate });

    if (minPrice) queryBuilder.andWhere('featuredAd.price >= :minPrice', { minPrice });

    if (maxPrice) queryBuilder.andWhere('featuredAd.price <= :maxPrice', { maxPrice });

    if (isActive !== null) {
      const condition = isActive
        ? 'featuredAd.from <= :today AND featuredAd.until >= :today'
        : 'featuredAd.from >= :today OR featuredAd.until <= :today';

      queryBuilder.andWhere(condition, { today: new Date() });
    }


    const [featuredAds, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(featuredAds, total, perPage);
  }

  async create(createFeaturedAdDto: CreateFeaturedAdDto): Promise<FeaturedAd> {
    const featuredAd = FeaturedAd.create(createFeaturedAdDto);

    return await this.featuredAdsRepository.save(featuredAd);
  }

  async findOne(id: number): Promise<FeaturedAd> {
    const featuredAd = await this.featuredAdsRepository.findOne(+id);

    if (!featuredAd) {
      throw new FeaturedAdNotFoundException();
    }

    return featuredAd;
  }

  async update({id, ...updateFeaturedAdDto}: UpdateFeaturedAdDto): Promise<FeaturedAd> {
    const featuredAd = await this.findOne(+id);

    Object.assign(featuredAd, updateFeaturedAdDto);

    return await this.featuredAdsRepository.save(featuredAd);
  }

  async delete(id: number): Promise<void> {
    const featuredAd = await this.findOne(+id);

    await this.featuredAdsRepository.softRemove(featuredAd);
  }
}

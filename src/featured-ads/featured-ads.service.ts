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

  async paginate({offset, perPage, filters}: FeaturedAdPaginationOptionsDto): Promise<PaginationResult<FeaturedAd>> {
    const queryBuilder = this.featuredAdsRepository.createQueryBuilder('featuredAd')
      .take(perPage)
      .skip(offset)
      .leftJoinAndSelect('featuredAd.product', 'product')
      .leftJoinAndSelect('product.productImages', 'productImage')
      .leftJoinAndSelect('product.store', 'store')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile');

    if (filters.id) queryBuilder.andWhere('featuredAd.id = :id', {id: filters.id});

    if (filters.productId) queryBuilder.andWhere('featuredAd.productId = :productId', {productId: filters.productId});

    if (filters.storeCategoryId) queryBuilder.andWhere('featuredAd.storeCategoryId = :storeCategoryId', {storeCategoryId: filters.storeCategoryId});

    if (filters.date) queryBuilder.andWhere(':date BETWEEN featuredAd.from AND featuredAd.until', {date: filters.date});

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

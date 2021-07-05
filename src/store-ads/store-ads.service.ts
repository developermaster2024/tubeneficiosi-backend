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

  async paginate({perPage, offset, filters}: StoreAdPaginationOptionsDto): Promise<PaginationResult<StoreAd>> {
    const queryBuilder = this.storeAdsRepository.createQueryBuilder('storeAd')
      .take(perPage)
      .skip(offset);

    if (filters.id) queryBuilder.andWhere('storeAd.id = :id', {id: filters.id});

    if (filters.date) queryBuilder.andWhere(':date BETWEEN storeAd.from AND storeAd.until', {date: filters.date});

    const [storeAds, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(storeAds, total, perPage);
  }

  async create(createStoreAdDto: CreateStoreAdDto): Promise<StoreAd> {
    const storeAd = StoreAd.create(createStoreAdDto);

    return await this.storeAdsRepository.save(storeAd);
  }

  async findOne(id: number): Promise<StoreAd> {
    const storeAd = await this.storeAdsRepository.findOne(id);

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

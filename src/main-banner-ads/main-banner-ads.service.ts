import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { CreateMainBannerAdDto } from './dto/create-main-banner-ad.dto';
import { MainBannerAdPaginationOptionsDto } from './dto/main-banner-ad-pagination-options.dto';
import { UpdateMainBannerAdDto } from './dto/update-main-banner.dto';
import { MainBannerAd } from './entities/main-banner-ad.entity';
import { MainBannerAdNotFoundException } from './errors/main-banner-ad-not-found.exception';

@Injectable()
export class MainBannerAdsService {
  constructor(@InjectRepository(MainBannerAd) private readonly mainBannerAds: Repository<MainBannerAd>) {}

  async paginate({offset, perPage, filters: {
    id,
    priority,
    storeName,
    minDate,
    maxDate,
    minPrice,
    maxPrice,
    url,
    isActive,
  }}: MainBannerAdPaginationOptionsDto): Promise<PaginationResult<MainBannerAd>> {
    const queryBuilder = this.mainBannerAds.createQueryBuilder('mainBannerAds')
      .leftJoinAndSelect('mainBannerAds.store', 'store')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile')
      .take(perPage)
      .skip(offset);

    if (id) queryBuilder.andWhere('mainBannerAds.id = :id', { id });

    if (priority) queryBuilder.andWhere('mainBannerAds.priority LIKE :priority', { priority });

    if (storeName) queryBuilder.andWhere('store.name LIKE :storeName', { storeName: `%${storeName}%` });

    if (minDate) queryBuilder.andWhere('mainBannerAds.from >= :minDate', { minDate });

    if (maxDate) queryBuilder.andWhere('mainBannerAds.until <= :maxDate', { maxDate });

    if (minPrice) queryBuilder.andWhere('mainBannerAds.price >= :minPrice', { minPrice });

    if (maxPrice) queryBuilder.andWhere('mainBannerAds.price <= :maxPrice', { maxPrice });

    if (url) queryBuilder.andWhere('mainBannerAds.url LIKE :url', { url: `%${url}%` });

    if (isActive !== null) {
      const condition = isActive
        ? 'mainBannerAds.from <= :today AND mainBannerAds.until >= :today'
        : 'mainBannerAds.from >= :today OR mainBannerAds.until <= :today';

      queryBuilder.andWhere(condition, { today: new Date() });
    }

    const [mainBannerAds, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(mainBannerAds, total, perPage);
  }

  async create({image, ...createMainBannerAdDto}: CreateMainBannerAdDto): Promise<MainBannerAd> {
    const mainBannerAd = MainBannerAd.create({
      imgPath: image.path,
      ...createMainBannerAdDto,
    });

    return await this.mainBannerAds.save(mainBannerAd);
  }

  async findOne(id: number): Promise<MainBannerAd> {
    const mainBannerAd = await this.mainBannerAds.findOne(id);

    if (!mainBannerAd) {
      throw new MainBannerAdNotFoundException();
    }

    return mainBannerAd;
  }

  async update({id, image, ...updateMainBannerAdDto}: UpdateMainBannerAdDto): Promise<MainBannerAd> {
    const mainBannerAd = await this.findOne(+id);

    Object.assign(mainBannerAd, updateMainBannerAdDto);

    if (image) mainBannerAd.imgPath = image.path;

    return await this.mainBannerAds.save(mainBannerAd);
  }

  async delete(id: number): Promise<void> {
    const mainBannerAd = await this.findOne(id);

    await this.mainBannerAds.softRemove(mainBannerAd);
  }
}

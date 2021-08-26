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
    storeId,
    date,
    isActive,
  }}: MainBannerAdPaginationOptionsDto): Promise<PaginationResult<MainBannerAd>> {
    const queryBuilder = this.mainBannerAds.createQueryBuilder('mainBannerAds')
      .leftJoinAndSelect('mainBannerAds.store', 'store')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile')
      .take(perPage)
      .skip(offset);

    if (id) queryBuilder.andWhere('mainBannerAds.id = :id', { id });

    if (storeId) queryBuilder.andWhere('mainBannerAds.storeId = :storeId', { storeId });

    if (date) queryBuilder.andWhere(':date BETWEEN mainBannerAds.from AND mainBannerAds.until', { date });

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

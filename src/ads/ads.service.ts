import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { AdPaginationOptionsDto } from './dto/ad-pagination-options.dto';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { Ad } from './entities/ad.entity';
import { AdNotFound } from './errors/ad-not-found.dto';

@Injectable()
export class AdsService {
  constructor(@InjectRepository(Ad) private readonly adsRepository: Repository<Ad>) {}

  async paginate({offset, perPage, filters: {
    id,
    title,
    description,
    storeId,
    minDate,
    maxDate,
    minPrice,
    maxPrice,
    url,
    adsPositionId,
    isActive,
  }}: AdPaginationOptionsDto): Promise<PaginationResult<Ad>> {
    const queryBuilder = this.adsRepository.createQueryBuilder('ad')
      .leftJoinAndSelect('ad.adsPosition', 'adsPosition')
      .leftJoinAndSelect('ad.store', 'store')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile')
      .take(perPage)
      .skip(offset);

    if (id) queryBuilder.andWhere('ad.id = :id', { id });

    if (title) queryBuilder.andWhere('ad.title LIKE :title', { title: `%${title}%` });

    if (description) queryBuilder.andWhere('ad.description LIKE :description', { description: `%${description}%` });

    if (minPrice) queryBuilder.andWhere('ad.price >= :minPrice', { minPrice });

    if (maxPrice) queryBuilder.andWhere('ad.price <= :maxPrice', { maxPrice });

    if (minDate) queryBuilder.andWhere('ad.from >= :minDate', { minDate });

    if (maxDate) queryBuilder.andWhere('ad.until <= :maxDate', { maxDate });

    if (storeId) queryBuilder.andWhere('ad.storeId = :storeId', { storeId });

    if (url) queryBuilder.andWhere('ad.url LIKE :url', { url: `%${url}%` });

    if (adsPositionId) queryBuilder.andWhere('ad.adsPositionId = :adsPositionId', { adsPositionId });

    if (isActive !== null) {
      const condition = isActive
        ? 'ad.from <= :today AND ad.until >= :today'
        : 'ad.from >= :today OR ad.until <= :today';

      queryBuilder.andWhere(condition, { today: new Date() });
    }

    const [ads, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(ads, total, perPage);
  }

  async create({image, ...createAdDto}: CreateAdDto): Promise<Ad> {
    const ad = Ad.create({
      ...createAdDto,
      imagePath: image.path,
    });

    return await this.adsRepository.save(ad);
  }

  async findOne(id: number): Promise<Ad> {
    const ad = await this.adsRepository.createQueryBuilder('ad')
      .leftJoinAndSelect('ad.adsPosition', 'adsPosition')
      .leftJoinAndSelect('ad.store', 'store')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile')
      .where('ad.id = :id', { id })
      .getOne();

    if (!ad) {
      throw new AdNotFound();
    }

    return ad;
  }

  async update({id, image, ...updateAdDto}: UpdateAdDto): Promise<Ad> {
    const ad = await this.adsRepository.createQueryBuilder('ad')
      .where('ad.id = :id', { id })
      .getOne();

    if (!ad) {
      throw new AdNotFound();
    }

    Object.assign(ad, updateAdDto);

    if (image) ad.imagePath = image.path;

    return await this.adsRepository.save(ad);
  }

  async delete(id: number): Promise<void> {
    const ad = await this.findOne(id);

    await this.adsRepository.softRemove(ad);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { AdPaginationOptionsDto } from './dto/ad-pagination-options.dto';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { Ad } from './entities/ads.entity';
import { AdNotFound } from './errors/ad-not-found.dto';

@Injectable()
export class AdsService {
  constructor(@InjectRepository(Ad) private readonly adsRepository: Repository<Ad>) {}

  async paginate({offset, perPage, filters}: AdPaginationOptionsDto): Promise<PaginationResult<Ad>> {
    const queryBuilder = this.adsRepository.createQueryBuilder('ad')
      .take(perPage)
      .skip(offset);

    if (filters.id) queryBuilder.andWhere('ad.id = :id', {id: filters.id});

    if (filters.storeId) queryBuilder.andWhere('ad.storeId = :storeId', {storeId: filters.storeId});

    if (filters.adsPositionId) queryBuilder.andWhere('ad.adsPositionId = :adsPositionId', {adsPositionId: filters.adsPositionId});

    if (filters.date) queryBuilder.andWhere(':date BETWEEN ad.from AND ad.until', {date: filters.date});

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
    const ad = await this.adsRepository.findOne(id);

    if (!ad) {
      throw new AdNotFound();
    }

    return ad;
  }

  async update({id, image, ...updateAdDto}: UpdateAdDto): Promise<Ad> {
    const ad = await this.findOne(+id);

    Object.assign(ad, updateAdDto);

    if (image) ad.imagePath = image.path;

    return await this.adsRepository.save(ad);
  }

  async delete(id: number): Promise<void> {
    const ad = await this.findOne(id);

    await this.adsRepository.softRemove(ad);
  }
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Days } from 'src/support/types/days.enum';
import { Repository } from 'typeorm';
import { UpdateStoreHourDto } from './dto/update-store-hour.dto';
import { StoreHour } from './entities/store-hour.entity';
import { StoreHourNotFoundException } from './errors/store-hour-not-found.exception';

@Injectable()
export class StoreHoursService {
  constructor(@InjectRepository(StoreHour) private readonly storeHoursService: Repository<StoreHour>) {}

  async paginate({offset, perPage}: PaginationOptions, userId: number): Promise<PaginationResult<StoreHour>> {
    const [storeHours, total] = await this.storeHoursService.createQueryBuilder('storeHour')
      .take(perPage)
      .skip(offset)
      .innerJoin('storeHour.store', 'store')
      .innerJoin('store.user', 'user')
      .andWhere('user.id = :userId', {userId})
      .getManyAndCount();

    return new PaginationResult(storeHours, total, perPage);
  }

  async findOne(day: Days, userId: number): Promise<StoreHour> {
    const storeHour = await this.storeHoursService.createQueryBuilder('storeHour')
      .innerJoin('storeHour.store', 'store')
      .innerJoin('store.user', 'user')
      .andWhere('user.id = :userId', {userId})
      .andWhere('storeHour.day = :day', {day: day})
      .getOne();

    if (!storeHour) {
      throw new StoreHourNotFoundException();
    }

    return storeHour;
  }

  async update({userId, day, ...updateStoreHourDto}: UpdateStoreHourDto): Promise<StoreHour> {
    const queryBuilder = this.storeHoursService.createQueryBuilder('storeHour')
      .innerJoin('storeHour.store', 'store')
      .innerJoin('store.user', 'user')
      .andWhere('user.id = :userId', {userId})
      .andWhere('storeHour.day = :day', {day});

    const storeHour = await queryBuilder.getOne();

    Object.assign(storeHour, updateStoreHourDto);

    return this.storeHoursService.save(storeHour);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { AdsPosition } from './entities/ads-position.entity';

@Injectable()
export class AdsPositionsService {
  constructor(@InjectRepository(AdsPosition) private readonly adsPositionsRepository: Repository<AdsPosition>) {}

  async paginate({perPage, offset}: PaginationOptions): Promise<PaginationResult<AdsPosition>> {
    const [adsPositions, total] = await this.adsPositionsRepository.findAndCount({
      take: perPage,
      skip: offset,
    });

    return new PaginationResult(adsPositions, total, perPage);
  }
}

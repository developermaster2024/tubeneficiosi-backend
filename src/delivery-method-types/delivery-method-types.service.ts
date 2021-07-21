import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { DeliveryMethodType } from './entities/delivery-method-type.entity';

@Injectable()
export class DeliveryMethodTypesService {
  constructor(@InjectRepository(DeliveryMethodType) private readonly deliveryMethodTypesRepository: Repository<DeliveryMethodType>) {}

  async paginate({perPage, offset}: PaginationOptions): Promise<PaginationResult<DeliveryMethodType>> {
    const [deliveryMethodTypes, total] = await this.deliveryMethodTypesRepository.findAndCount({
      take: perPage,
      skip: offset,
    });

    return new PaginationResult(deliveryMethodTypes, total, perPage);
  }
}

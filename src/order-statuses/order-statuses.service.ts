import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { OrderStatus } from './entities/order-status.entity';

@Injectable()
export class OrderStatusesService {
  constructor(@InjectRepository(OrderStatus) private readonly orderStatusesRepository: Repository<OrderStatus>) {}

  async paginate({perPage, offset}: PaginationOptions): Promise<PaginationResult<OrderStatus>> {
    const [orderStatuses, total] = await this.orderStatusesRepository.findAndCount({
      take: perPage,
      skip: offset,
    });

    return new PaginationResult(orderStatuses, total, perPage);
  }
}

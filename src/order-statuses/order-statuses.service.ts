import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { OrderStatusPaginationOptionsDto } from './dto/order-status-pagination-options.dto';
import { OrderStatus } from './entities/order-status.entity';

@Injectable()
export class OrderStatusesService {
  constructor(@InjectRepository(OrderStatus) private readonly orderStatusesRepository: Repository<OrderStatus>) {}

  async paginate({perPage, offset, filters: {
    code,
    allowedByCodeAndRole,
  }}: OrderStatusPaginationOptionsDto): Promise<PaginationResult<OrderStatus>> {
    const queryBuilder = this.orderStatusesRepository.createQueryBuilder('orderStatus')
      .take(perPage)
      .skip(offset);

    if (code) queryBuilder.andWhere('orderStatus.code = :code', { code });

    if (allowedByCodeAndRole?.length > 0) {
      const [allowedByCode, role] = allowedByCodeAndRole;

      queryBuilder.andWhere(`orderStatus.code IN (
        SELECT
          ostos.allowed_order_status_code
        FROM
          order_status_to_order_status ostos
        WHERE
          ostos.order_status_code = :allowedByCode AND
          ostos.role = :role
      )`, { allowedByCode, role });
    }

    const [orderStatuses, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(orderStatuses, total, perPage);
  }
}

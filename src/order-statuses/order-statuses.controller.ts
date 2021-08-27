import { Controller, Get, Query } from '@nestjs/common';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { OrderStatus } from './entities/order-status.entity';
import { OrderStatusesService } from './order-statuses.service';
import { OrderStatusPaginationPipe } from './pipes/order-status-pagination.pipe';

@Controller('order-statuses')
export class OrderStatusesController {
  constructor(private readonly orderStatusesService: OrderStatusesService) {}

  @Get()
  async paginate(@Query(OrderStatusPaginationPipe) options: any): Promise<PaginationResult<OrderStatus>> {
    return await this.orderStatusesService.paginate(options);
  }
}

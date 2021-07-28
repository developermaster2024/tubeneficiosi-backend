import { Controller, Get, Query } from '@nestjs/common';
import { PaginationPipe } from 'src/support/pagination/pagination-pipe';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { OrderStatus } from './entities/order-status.entity';
import { OrderStatusesService } from './order-statuses.service';

@Controller('order-statuses')
export class OrderStatusesController {
  constructor(private readonly orderStatusesService: OrderStatusesService) {}

  @Get()
  async paginate(@Query(PaginationPipe) options: any): Promise<PaginationResult<OrderStatus>> {
    return await this.orderStatusesService.paginate(options);
  }
}

import { Controller, Get, Query } from '@nestjs/common';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationPipe } from 'src/support/pagination/pagination-pipe';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { DeliveryMethodTypesService } from './delivery-method-types.service';
import { DeliveryMethodType } from './entities/delivery-method-type.entity';

@Controller('delivery-method-types')
export class DeliveryMethodTypesController {
  constructor(private readonly deliveryMethodTypesService: DeliveryMethodTypesService) {}

  @Get()
  async paginate(@Query(PaginationPipe) options: PaginationOptions): Promise<PaginationResult<DeliveryMethodType>> {
    return await this.deliveryMethodTypesService.paginate(options);
  }
}

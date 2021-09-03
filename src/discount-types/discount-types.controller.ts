import { Controller, Get, Query } from '@nestjs/common';
import { PaginationPipe } from 'src/support/pagination/pagination-pipe';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { DiscountTypesService } from './discount-types.service';
import { DiscountType } from './entities/discount-type.entity';

@Controller('discount-types')
export class DiscountTypesController {
  constructor(private readonly discountTypesService: DiscountTypesService) {}

  @Get()
  async paginate(@Query(PaginationPipe) options: any): Promise<PaginationResult<DiscountType>> {
    return await this.discountTypesService.paginate(options);
  }
}

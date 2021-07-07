import { Controller, Get, Query } from '@nestjs/common';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationPipe } from 'src/support/pagination/pagination-pipe';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { ReadStoreCategoryDto } from './dto/read-store-categories.dto';
import { StoreCategoriesService } from './store-categories.service';

@Controller('store-categories')
export class StoreCategoriesController {
  constructor(private readonly storeCategoriesService: StoreCategoriesService) {}

  @Get()
  async paginate(@Query(PaginationPipe) options: PaginationOptions): Promise<PaginationResult<ReadStoreCategoryDto>> {
    return (await this.storeCategoriesService.paginate(options)).toClass(ReadStoreCategoryDto);
  }
}

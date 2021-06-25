import { Controller, Get, Query } from '@nestjs/common';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationPipe } from 'src/support/pagination/pagination-pipe';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { AdsPositionsService } from './ads-positions.service';
import { ReadAdsPositionDto } from './dto/read-ads-position.dto';

@Controller('ads-positions')
export class AdsPositionsController {
  constructor(private readonly adsPositionsService: AdsPositionsService) {}

  @Get()
  async paginate(@Query(PaginationPipe) options: PaginationOptions): Promise<PaginationResult<ReadAdsPositionDto>> {
    return (await this.adsPositionsService.paginate(options)).toClass(ReadAdsPositionDto);
  }
}

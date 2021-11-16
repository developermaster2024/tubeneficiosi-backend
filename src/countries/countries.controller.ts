import { Controller, Get, Query } from '@nestjs/common';
import { PaginationPipe } from 'src/support/pagination/pagination-pipe';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { CountriesService } from './countries.service';
import { ReadCountryDto } from './dto/read-country.dto';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async paginate(@Query(PaginationPipe) options: any): Promise<PaginationResult<ReadCountryDto>> {
    return (await this.countriesService.paginate(options)).toClass(ReadCountryDto);
  }
}

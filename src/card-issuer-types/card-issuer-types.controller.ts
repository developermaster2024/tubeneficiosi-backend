import { Controller, Get, Query } from '@nestjs/common';
import { ReadCardIssuerDto } from 'src/card-issuers/dto/read-card-issuer.dto';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationPipe } from 'src/support/pagination/pagination-pipe';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { CardIssuerTypesService } from './card-issuer-types.service';
import { ReadCardIssuerType } from './entities/dto/read-card-issuer-type.dto';

@Controller('card-issuer-types')
export class CardIssuerTypesController {
  constructor(private readonly cardIssuerTypesService: CardIssuerTypesService) {}

  @Get()
  async paginate(@Query(PaginationPipe) options: PaginationOptions): Promise<PaginationResult<ReadCardIssuerType>> {
    return (await this.cardIssuerTypesService.paginate(options)).toClass(ReadCardIssuerType);
  }
}

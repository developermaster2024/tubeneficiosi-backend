import { Controller, Get, Query } from '@nestjs/common';
import { PaginationPipe } from 'src/support/pagination/pagination-pipe';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { BankAccountPurposesService } from './bank-account-purposes.service';
import { BankAccountPurpose } from './entities/bank-account-purpose.entity';

@Controller('bank-account-purposes')
export class BankAccountPurposesController {
  constructor(private readonly bankAccountPurposesService: BankAccountPurposesService) {}

  @Get()
  async paginate(@Query(PaginationPipe) options: any): Promise<PaginationResult<BankAccountPurpose>> {
    return await this.bankAccountPurposesService.paginate(options);
  }
}

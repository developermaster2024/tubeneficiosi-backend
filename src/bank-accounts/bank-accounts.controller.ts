import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/roles.enum';
import { BankAccountsService } from './bank-accounts.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { ReadBankAccountDto } from './dto/read-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { BankAccountPaginationPipe } from './pipes/bank-account-pagination.pipe';

@Controller('bank-accounts')
export class BankAccountsController {
  constructor(private readonly bankAccountsService: BankAccountsService) {}

  @Get()
  async paginate(@Query(BankAccountPaginationPipe) options: any): Promise<PaginationResult<ReadBankAccountDto>> {
    return (await this.bankAccountsService.paginate(options)).toClass(ReadBankAccountDto);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createBankAccountDto: CreateBankAccountDto): Promise<ReadBankAccountDto> {
    return plainToClass(ReadBankAccountDto, await this.bankAccountsService.create(createBankAccountDto));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadBankAccountDto> {
    return plainToClass(ReadBankAccountDto, await this.bankAccountsService.findOne(+id));
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new ParamsToBodyInterceptor({id: 'id'}))
  async update(@Body() udpateBankAccountDto: UpdateBankAccountDto): Promise<ReadBankAccountDto> {
    return plainToClass(ReadBankAccountDto, await this.bankAccountsService.update(udpateBankAccountDto));
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param('id') id: string): Promise<void> {
    await this.bankAccountsService.delete(+id);
  }
}

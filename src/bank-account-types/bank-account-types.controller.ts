import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationPipe } from 'src/support/pagination/pagination-pipe';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/roles.enum';
import { BankAccountTypesService } from './bank-account-types.service';
import { CreateBankAccountTypeDto } from './dto/create-bank-account.dto';
import { ReadBankAccountTypeDto } from './dto/read-bank-account-type.dto';
import { UpdateBankAccountTypeDto } from './dto/update-bank-account.dto';

@Controller('bank-account-types')
export class BankAccountTypesController {
  constructor(private readonly bankAccountTypesService: BankAccountTypesService) {}

  @Get()
  async paginate(@Query(PaginationPipe) options: any): Promise<PaginationResult<ReadBankAccountTypeDto>> {
    return (await this.bankAccountTypesService.paginate(options)).toClass(ReadBankAccountTypeDto);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createBankAccountTypeDto: CreateBankAccountTypeDto): Promise<ReadBankAccountTypeDto> {
    return plainToClass(ReadBankAccountTypeDto, await this.bankAccountTypesService.create(createBankAccountTypeDto));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadBankAccountTypeDto> {
    return plainToClass(ReadBankAccountTypeDto, await this.bankAccountTypesService.findOne(+id));
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new ParamsToBodyInterceptor({id: 'id'}))
  async update(@Body() updateBankAccountTypeDto: UpdateBankAccountTypeDto): Promise<ReadBankAccountTypeDto> {
    return plainToClass(ReadBankAccountTypeDto, await this.bankAccountTypesService.update(updateBankAccountTypeDto));
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param('id') id: string): Promise<void> {
    await this.bankAccountTypesService.delete(+id);
  }
}

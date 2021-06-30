import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { FileToBodyInterceptor } from 'src/support/interceptors/file-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/roles.enum';
import { BanksService } from './banks.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { ReadBankDto } from './dto/read-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { BankPaginationPipe } from './pipes/bank-pagination.pipe';

@Controller('banks')
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @Get()
  async paginate(@Query(BankPaginationPipe) options: any): Promise<PaginationResult<ReadBankDto>> {
    return (await this.banksService.paginate(options)).toClass(ReadBankDto);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'), new FileToBodyInterceptor('image'))
  async create(@Body() createBankDto: CreateBankDto): Promise<ReadBankDto> {
    return plainToClass(ReadBankDto, await this.banksService.create(createBankDto));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadBankDto> {
    return plainToClass(ReadBankDto, await this.banksService.findOne(+id));
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'), new FileToBodyInterceptor('image'), new ParamsToBodyInterceptor({id: 'id'}))
  async update(@Body() updateBankDto: UpdateBankDto): Promise<ReadBankDto> {
    return plainToClass(ReadBankDto, await this.banksService.update(updateBankDto));
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param('id') id: string): Promise<void> {
    await this.banksService.delete(+id);
  }
}

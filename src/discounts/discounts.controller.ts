import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { FileToBodyInterceptor } from 'src/support/interceptors/file-to-body.interceptor';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/roles.enum';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { ReadDiscountDto } from './dto/read-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { DiscountPaginationPipe } from './pipes/discount-pagination.pipe';

@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Get()
  async paginate(@Query(DiscountPaginationPipe) options: any): Promise<PaginationResult<ReadDiscountDto>> {
    return (await this.discountsService.paginate(options)).toClass(ReadDiscountDto);
  }

  @Post()
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'), new FileToBodyInterceptor('image'), new JwtUserToBodyInterceptor())
  async create(@Body() createDiscountDto: CreateDiscountDto): Promise<ReadDiscountDto> {
    return plainToClass(ReadDiscountDto, await this.discountsService.create(createDiscountDto));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadDiscountDto> {
    return plainToClass(ReadDiscountDto, await this.discountsService.findOne(+id));
  }

  @Put(':id')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    FileInterceptor('image'),
    new FileToBodyInterceptor('image'),
    new JwtUserToBodyInterceptor(),
    new ParamsToBodyInterceptor({id: 'id'})
  )
  async udpate(@Body() udpateDiscountDto: UpdateDiscountDto): Promise<ReadDiscountDto> {
    return plainToClass(ReadDiscountDto, await this.discountsService.update(udpateDiscountDto));
  }

  @Delete(':id')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async delete(
    @Param('id') id: string,
    @Body('userId') userId: number
  ): Promise<void> {
    await this.discountsService.delete(+id, userId);
  }
}

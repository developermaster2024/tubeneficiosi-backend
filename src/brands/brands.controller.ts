import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { ReadBrandDto } from './dto/read-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandPaginationPipe } from './pipes/brand-pagination.pipe';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  async paginate(@Query(BrandPaginationPipe) options: any): Promise<PaginationResult<ReadBrandDto>> {
    return (await this.brandsService.paginate(options)).toClass(ReadBrandDto);
  }

  @Post()
  async create(@Body() createBrandDto: CreateBrandDto): Promise<ReadBrandDto> {
    return plainToClass(ReadBrandDto, await this.brandsService.create(createBrandDto));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadBrandDto> {
    return plainToClass(ReadBrandDto, await this.brandsService.findOne(+id));
  }

  @Put(':id')
  @UseInterceptors(new ParamsToBodyInterceptor({id: 'id'}))
  async update(@Body() updateBrandDto: UpdateBrandDto): Promise<ReadBrandDto> {
    return plainToClass(ReadBrandDto, await this.brandsService.update(updateBrandDto));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.brandsService.delete(+id);
  }
}

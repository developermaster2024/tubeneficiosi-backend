import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/roles.enum';
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
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createBrandDto: CreateBrandDto): Promise<ReadBrandDto> {
    return plainToClass(ReadBrandDto, await this.brandsService.create(createBrandDto));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadBrandDto> {
    return plainToClass(ReadBrandDto, await this.brandsService.findOne(+id));
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new ParamsToBodyInterceptor({id: 'id'}))
  async update(@Body() updateBrandDto: UpdateBrandDto): Promise<ReadBrandDto> {
    return plainToClass(ReadBrandDto, await this.brandsService.update(updateBrandDto));
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.brandsService.delete(+id);
  }
}

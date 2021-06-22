import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/roles.enum';
import { CreateProductFeatureDto } from './dto/create-product-feature.dto';
import { ReadProductFeatureDto } from './dto/read-product-feature.dto';
import { UpdateProductFeatureDto } from './dto/update-product-feature.dto';
import { ProductFeaturePaginationPipe } from './pipes/product-feature-pagination.pipe';
import { ProductFeaturesService } from './product-features.service';

@Controller('product-features')
@UseGuards(JwtAuthGuard)
export class ProductFeaturesController {
  constructor(private readonly productFeaturesService: ProductFeaturesService) {}

  @Get()
  @Roles(Role.STORE)
  @UseGuards(RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async paginate(
    @Query(ProductFeaturePaginationPipe) options: any,
    @Body('userId') userId: number
  ): Promise<PaginationResult<ReadProductFeatureDto>> {
    return (await this.productFeaturesService.paginate(options, userId)).toClass(ReadProductFeatureDto);
  }

  @Post()
  @Roles(Role.STORE)
  @UseGuards(RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async create(@Body() createProductFeatureDto: CreateProductFeatureDto): Promise<ReadProductFeatureDto> {
    return plainToClass(ReadProductFeatureDto, await this.productFeaturesService.create(createProductFeatureDto));
  }

  @Get(':id')
  @Roles(Role.STORE)
  @UseGuards(RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async findOne(
    @Param('id') id: string,
    @Body('userId') userId: number,
  ): Promise<ReadProductFeatureDto> {
    return plainToClass(ReadProductFeatureDto, await this.productFeaturesService.findOne(+id, userId));
  }

  @Put(':id')
  @Roles(Role.STORE)
  @UseGuards(RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({id: 'id'}))
  async update(@Body() updateProductFeatureDto: UpdateProductFeatureDto): Promise<ReadProductFeatureDto> {
    return plainToClass(ReadProductFeatureDto, await this.productFeaturesService.update(updateProductFeatureDto));
  }

  @Delete(':id')
  @Roles(Role.STORE)
  @UseGuards(RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id') id: string,
    @Body('userId') userId: number,
  ): Promise<void> {
    await this.productFeaturesService.delete(+id, userId);
  }
}

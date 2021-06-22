import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { SlugifierInterceptor } from 'src/support/interceptors/slugifier.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/roles.enum';
import { CreateProductDto } from './dto/create-product.dto';
import { ReadProductDto } from './dto/read-product.dto';
import { ProductPaginationPipe } from './pipes/product-pagination.pipe';
import { ProductsService } from './products.service';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async paginate(@Query(ProductPaginationPipe) options: any): Promise<PaginationResult<ReadProductDto>> {
    return (await this.productsService.paginate(options)).toClass(ReadProductDto);
  }

  @Post()
  @Roles(Role.STORE)
  @UseGuards(RolesGuard)
  @UseInterceptors(FilesInterceptor('images'), new JwtUserToBodyInterceptor(), new SlugifierInterceptor({name: 'slug'}))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() images: Express.Multer.File[]
  ): Promise<ReadProductDto> {
    return plainToClass(ReadProductDto, await this.productsService.create(createProductDto, images));
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string): Promise<ReadProductDto> {
    return plainToClass(ReadProductDto, await this.productsService.findOneBySlug(slug));
  }

  @Delete(':id')
  @Roles(Role.STORE)
  @UseGuards(RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id') id: string,
    @Body('userId') userId: number
  ): Promise<void> {
    await this.productsService.delete(+id, userId);
  }
}

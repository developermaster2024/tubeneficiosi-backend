import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AllowAny } from 'src/support/custom-decorators/allow-any';
import { FileToBodyInterceptor } from 'src/support/interceptors/file-to-body.interceptor';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { SlugifierInterceptor } from 'src/support/interceptors/slugifier.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/roles.enum';
import { AddProductVideoDto } from './dto/add-product-video.dto';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { DeleteProductImageDto } from './dto/delete-product-image.dto';
import { DeleteProductVideoDto } from './dto/delete-product-video.dto';
import { ReadProductDto } from './dto/read-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UploadHtmlImageDto } from './dto/upload-html-image.dto';
import { ProductImage } from './entities/product-image.entity';
import { ProductVideo } from './entities/product-video.entity';
import { ProductPaginationPipe } from './pipes/product-pagination.pipe';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @AllowAny()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async paginate(
    @Query(ProductPaginationPipe) options: any,
    @Body('userId') userId: number
  ): Promise<PaginationResult<ReadProductDto>> {
    return (await this.productsService.paginate(options, userId)).toClass(ReadProductDto);
  }

  @Post()
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FilesInterceptor('images'), new JwtUserToBodyInterceptor(), new SlugifierInterceptor({name: 'slug'}))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() images: Express.Multer.File[]
  ): Promise<ReadProductDto> {
    return plainToClass(ReadProductDto, await this.productsService.create(createProductDto, images));
  }

  @Get(':id(\\d+)')
  async findOneById(@Param('id') id: string): Promise<ReadProductDto> {
    return plainToClass(ReadProductDto, await this.productsService.findOneById(+id))
  }

  @Get(':slug')
  @AllowAny()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async findOne(
    @Param('slug') slug: string,
    @Body('userId') userId: number
  ): Promise<ReadProductDto> {
    return plainToClass(ReadProductDto, await this.productsService.findOneBySlug(slug, userId));
  }

  @Put(':id')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({id: 'id'}))
  async update(@Body() updateProductDto: UpdateProductDto): Promise<ReadProductDto> {
    return plainToClass(ReadProductDto, await this.productsService.update(updateProductDto));
  }

  @Delete(':id')
  @Roles(Role.STORE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id') id: string,
    @Body('userId') userId: number
  ): Promise<void> {
    await this.productsService.delete(+id, userId);
  }

  @Post(':id/images')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'), new FileToBodyInterceptor('image'), new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({id: 'productId'}))
  async createProductImage(@Body() createProductImageDto: CreateProductImageDto): Promise<ProductImage> {
    return await this.productsService.createProductImage(createProductImageDto);
  }

  @Delete(':id/images/:position')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({id: 'productId', position: 'position'}))
  async deleteProductImage(@Body() deleteProductImageDto: DeleteProductImageDto): Promise<void> {
    await this.productsService.deleteProductImage(deleteProductImageDto);
  }

  @Post('upload-html-image')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'), new FileToBodyInterceptor('image'))
  async uploadHtmlImage(@Body() uploadHtmlImageDto: UploadHtmlImageDto): Promise<{url: string}> {
    return await this.productsService.uploadHtmlImage(uploadHtmlImageDto);
  }

  @Post(':id/videos')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ id: 'productId' }))
  async addProductVideo(@Body() addProductVideoDto: AddProductVideoDto): Promise<ProductVideo> {
    return await this.productsService.addProductVideo(addProductVideoDto);
  }

  @Delete(':id/videos/:videoId')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ id: 'productId', videoId: 'videoId' }))
  async deleteProductVideo(@Body() deleteProductVideoDto: DeleteProductVideoDto): Promise<void> {
    await this.productsService.deleteProductVideo(deleteProductVideoDto);
  }
}

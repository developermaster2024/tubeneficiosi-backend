import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationPipe } from 'src/support/pagination/pagination-pipe';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/roles.enum';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ReadCategoryDto } from './dto/read-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('stores/categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Roles(Role.STORE)
  @UseGuards(RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async paginate(
    @Body('userId') userId: number,
    @Query(PaginationPipe) options: PaginationOptions
  ): Promise<PaginationResult<ReadCategoryDto>> {
    return (await this.categoriesService.paginate(options, userId)).toClass(ReadCategoryDto);
  }

  @Post()
  @Roles(Role.STORE)
  @UseGuards(RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<ReadCategoryDto> {
    return plainToClass(ReadCategoryDto, await this.categoriesService.create(createCategoryDto));
  }

  @Get(':id')
  @Roles(Role.STORE)
  @UseGuards(RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async findOne(
    @Param('id') id: string,
    @Body('userId') userId: number
  ): Promise<ReadCategoryDto> {
    return plainToClass(ReadCategoryDto, await this.categoriesService.findOne(+id, userId));
  }

  @Put(':id')
  @Roles(Role.STORE)
  @UseGuards(RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({id: 'id'}))
  async update(@Body() updateCategoryDto: UpdateCategoryDto): Promise<ReadCategoryDto> {
    return plainToClass(ReadCategoryDto, await this.categoriesService.udpate(updateCategoryDto));
  }

  @Delete(':id')
  @Roles(Role.STORE)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async delete(
    @Param('id') id: string,
    @Body('userId') userId: number
  ): Promise<void> {
    return await this.categoriesService.delete(+id, userId);
  }
}

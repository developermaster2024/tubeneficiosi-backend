import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AllowAny } from 'src/support/custom-decorators/allow-any';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/roles.enum';
import { CreateStoreDto } from './dto/create-store.dto';
import { ReadStoreDto } from './dto/read-store.dto';
import { UpdateStorePasswordDto } from './dto/update-store-password.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StorePaginationPipe } from './pipes/store-pagination.pipe';
import { StoresService } from './stores.service';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  @AllowAny()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async paginate(
    @Query(StorePaginationPipe) options: any,
    @Body('userId') userId: number
  ): Promise<PaginationResult<ReadStoreDto>> {
    return (await this.storesService.paginate(options, userId)).toClass(ReadStoreDto);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileFieldsInterceptor([
    {name: 'banner', maxCount: 1},
    {name: 'logo', maxCount: 1},
    {name: 'frontImage', maxCount: 1},
  ], {dest: 'uploads/stores/'}))
  async create(
    @Body() createStoreCreate: CreateStoreDto,
    @UploadedFiles() images
  ): Promise<ReadStoreDto> {
    return plainToClass(ReadStoreDto, await this.storesService.create(createStoreCreate, {
      banner: images?.banner?.[0]?.path,
      logo: images?.logo?.[0]?.path,
      frontImage: images?.frontImage?.[0]?.path,
    }));
  }

  @Get(':id(\\d+)')
  @AllowAny()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async findOneById(
    @Param('id') id: string,
    @Body('userId') userId: number
  ): Promise<ReadStoreDto> {
    return plainToClass(ReadStoreDto, await this.storesService.findOneById(+id, userId));
  }

  @Get(':slug')
  @AllowAny()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async findOneBySlug(
    @Param('slug') slug: string,
    @Body('userId') userId: number
  ): Promise<ReadStoreDto> {
    return plainToClass(ReadStoreDto, await this.storesService.findOneBySlug(slug, userId));
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      {name: 'banner', maxCount: 1},
      {name: 'logo', maxCount: 1},
      {name: 'frontImage', maxCount: 1},
    ], {dest: 'uploads/stores/'}),
    new ParamsToBodyInterceptor({id: 'id'})
  )
  async update(
    @Body() updateStoreDto: UpdateStoreDto,
    @UploadedFiles() images
  ): Promise<ReadStoreDto> {
    return plainToClass(ReadStoreDto, this.storesService.update(updateStoreDto, {
      banner: images?.banner?.[0]?.path,
      logo: images?.logo?.[0]?.path,
      frontImage: images?.frontImage?.[0]?.path,
    }));
  }

  @Put(':id/password')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new ParamsToBodyInterceptor({id: 'id'}))
  async updatePassword(@Body() updateStorePasswordDto: UpdateStorePasswordDto): Promise<ReadStoreDto> {
    return plainToClass(ReadStoreDto, await this.storesService.updatePassword(updateStorePasswordDto));
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.storesService.delete(+id);
  }
}

import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { FileToBodyInterceptor } from 'src/support/interceptors/file-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/roles.enum';
import { CreateMainBannerAdDto } from './dto/create-main-banner-ad.dto';
import { ReadMainBannerAdDto } from './dto/read-main-banner.dto';
import { UpdateMainBannerAdDto } from './dto/update-main-banner.dto';
import { MainBannerAdsService } from './main-banner-ads.service';
import { MainBannerAdPaginationPipe } from './pipes/main-banner-ad-pagination.pipe';

@Controller('main-banner-ads')
export class MainBannerAdsController {
  constructor(private readonly mainBannerAdsService: MainBannerAdsService) {}

  @Get()
  async paginate(@Query(MainBannerAdPaginationPipe) options: any): Promise<PaginationResult<ReadMainBannerAdDto>> {
    return (await this.mainBannerAdsService.paginate(options)).toClass(ReadMainBannerAdDto);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'), new FileToBodyInterceptor('image'))
  async create(@Body() createMainBannerAdDto: CreateMainBannerAdDto): Promise<ReadMainBannerAdDto> {
    return plainToClass(ReadMainBannerAdDto, await this.mainBannerAdsService.create(createMainBannerAdDto));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadMainBannerAdDto> {
    return plainToClass(ReadMainBannerAdDto, await this.mainBannerAdsService.findOne(+id));
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'), new FileToBodyInterceptor('image'), new ParamsToBodyInterceptor({id: 'id'}))
  async update(@Body() updateMainBannerAdDto: UpdateMainBannerAdDto): Promise<ReadMainBannerAdDto> {
    return plainToClass(ReadMainBannerAdDto, await this.mainBannerAdsService.update(updateMainBannerAdDto));
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.mainBannerAdsService.delete(+id);
  }
}

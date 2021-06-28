import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/roles.enum';
import { CreateFeaturedAdDto } from './dto/create-featured-ad.dto';
import { ReadFeaturedAdDto } from './dto/read-featured-ad.dto';
import { UpdateFeaturedAdDto } from './dto/update-featured-ad.dto';
import { FeaturedAdsService } from './featured-ads.service';
import { FeaturedAdPaginationPipe } from './pipes/featured-ad-pagination.pipe';

@Controller('featured-ads')
export class FeaturedAdsController {
  constructor(private readonly featuredAdsService: FeaturedAdsService) {}

  @Get()
  async paginate(@Query(FeaturedAdPaginationPipe) options: any): Promise<PaginationResult<ReadFeaturedAdDto>> {
    return (await this.featuredAdsService.paginate(options)).toClass(ReadFeaturedAdDto);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createFeaturedAdDto: CreateFeaturedAdDto): Promise<ReadFeaturedAdDto> {
    return plainToClass(ReadFeaturedAdDto, await this.featuredAdsService.create(createFeaturedAdDto));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadFeaturedAdDto> {
    return plainToClass(ReadFeaturedAdDto, await this.featuredAdsService.findOne(+id));
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new ParamsToBodyInterceptor({id: 'id'}))
  async update(@Body() updateFeaturedAdDto: UpdateFeaturedAdDto): Promise<ReadFeaturedAdDto> {
    return plainToClass(ReadFeaturedAdDto, await this.featuredAdsService.update(updateFeaturedAdDto));
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param('id') id: string): Promise<void> {
    await this.featuredAdsService.delete(+id);
  }
}

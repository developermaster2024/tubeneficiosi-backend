import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ReadStoreDto } from 'src/stores/dto/read-store.dto';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/roles.enum';
import { CreateStoreAdDto } from './dto/create-store-ad.dto';
import { ReadStoreAdDto } from './dto/read-store-ad.dto';
import { UpdateStoreAdDto } from './dto/update-store-ad.dto';
import { StoreAdPaginationPipe } from './pipes/store-ad-pagination.pipe';
import { StoreAdsService } from './store-ads.service';

@Controller('store-ads')
export class StoreAdsController {
  constructor(private readonly storeAdsService: StoreAdsService) {}

  @Get()
  async paginate(@Query(StoreAdPaginationPipe) options: any): Promise<PaginationResult<ReadStoreAdDto>> {
    return (await this.storeAdsService.paginate(options)).toClass(ReadStoreAdDto);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createStoreAdDto: CreateStoreAdDto): Promise<ReadStoreAdDto> {
    return plainToClass(ReadStoreAdDto, await this.storeAdsService.create(createStoreAdDto));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadStoreDto> {
    return plainToClass(ReadStoreDto, await this.storeAdsService.findOne(+id));
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new ParamsToBodyInterceptor({id: 'id'}))
  async update(@Body() updateStoreAdDto: UpdateStoreAdDto): Promise<ReadStoreAdDto> {
    return plainToClass(ReadStoreAdDto, await this.storeAdsService.update(updateStoreAdDto));
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param('id') id: string): Promise<void> {
    await this.storeAdsService.delete(+id);
  }
}

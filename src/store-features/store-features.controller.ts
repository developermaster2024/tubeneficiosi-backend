import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/roles.enum';
import { CreateStoreFeatureDto } from './dto/create-store-feature.dto';
import { ReadStoreFeatureDto } from './dto/read-store-feature.dto';
import { UpdateStoreFeatureDto } from './dto/update-store-feature.dto';
import { StoreFeaturePaginationPipe } from './pipes/store-feature-pagination.pipe';
import { StoreFeaturesService } from './store-features.service';

@Controller('store-features')
export class StoreFeaturesController {
  constructor(private readonly storeFeaturesService: StoreFeaturesService) {}

  @Get()
  async paginate(@Query(StoreFeaturePaginationPipe) options: any): Promise<PaginationResult<ReadStoreFeatureDto>> {
    return (await this.storeFeaturesService.paginate(options)).toClass(ReadStoreFeatureDto);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createStoreFeatureDto: CreateStoreFeatureDto): Promise<ReadStoreFeatureDto> {
    return plainToClass(ReadStoreFeatureDto, await this.storeFeaturesService.create(createStoreFeatureDto));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadStoreFeatureDto> {
    return plainToClass(ReadStoreFeatureDto, await this.storeFeaturesService.findOne(+id));
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new ParamsToBodyInterceptor({ id: 'id' }))
  async update(@Body() updateStoreFeatureDto: UpdateStoreFeatureDto): Promise<ReadStoreFeatureDto> {
    return plainToClass(ReadStoreFeatureDto, await this.storeFeaturesService.update(updateStoreFeatureDto));
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.storeFeaturesService.delete(+id);
  }
}

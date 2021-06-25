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
import { AdsService } from './ads.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { ReadAdDto } from './dto/read-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { AdPaginationPipe } from './pipes/ad-pagination.pipe';

@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Get()
  async paginate(@Query(AdPaginationPipe) options: any): Promise<PaginationResult<ReadAdDto>> {
    return (await this.adsService.paginate(options)).toClass(ReadAdDto);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'), new FileToBodyInterceptor('image'))
  async create(@Body() createAdDto: CreateAdDto): Promise<ReadAdDto> {
    return plainToClass(ReadAdDto, await this.adsService.create(createAdDto));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadAdDto> {
    return plainToClass(ReadAdDto, await this.adsService.findOne(+id));
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'), new FileToBodyInterceptor('image'), new ParamsToBodyInterceptor({id: 'id'}))
  async update(@Body() updateAdDto: UpdateAdDto): Promise<ReadAdDto> {
    return plainToClass(ReadAdDto, await this.adsService.update(updateAdDto));
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.adsService.delete(+id);
  }
}

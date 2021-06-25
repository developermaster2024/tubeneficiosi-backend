import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/roles.enum';
import { CreateLocationDto } from './dto/create-location.dto';
import { ReadLocationDto } from './dto/read-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationsService } from './locations.service';
import { LocationPaginationPipe } from './pipes/location-pagination.pipe';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  async paginate(@Query(LocationPaginationPipe) options: any): Promise<PaginationResult<ReadLocationDto>> {
    return (await this.locationsService.paginate(options)).toClass(ReadLocationDto);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createLocationDto: CreateLocationDto): Promise<ReadLocationDto> {
    return plainToClass(ReadLocationDto, await this.locationsService.create(createLocationDto));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadLocationDto> {
    return plainToClass(ReadLocationDto, await this.locationsService.findOne(+id));
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new ParamsToBodyInterceptor({id: 'id'}))
  async update(@Body() updateLocationDto: UpdateLocationDto): Promise<ReadLocationDto> {
    return plainToClass(ReadLocationDto, await this.locationsService.update(updateLocationDto));
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.locationsService.delete(+id);
  }
}

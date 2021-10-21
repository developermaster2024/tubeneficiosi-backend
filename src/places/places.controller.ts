import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/roles.enum';
import { CreatePlaceDto } from './dto/create-place.dto';
import { DeletePlaceDto } from './dto/delete-place.dto';
import { ReadPlaceDto } from './dto/read-place.dto';
import { PlacePaginationPipe } from './pipes/place-pagination.pipe';
import { PlacesService } from './places.service';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get()
  async paginate(@Query(PlacePaginationPipe) options: any): Promise<PaginationResult<ReadPlaceDto>> {
    return (await this.placesService.paginate(options)).toClass(ReadPlaceDto);
  }

  @Post()
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async create(@Body() createPlaceDto: CreatePlaceDto): Promise<ReadPlaceDto> {
    return plainToClass(ReadPlaceDto, await this.placesService.create(createPlaceDto));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadPlaceDto> {
    return plainToClass(ReadPlaceDto, await this.placesService.findOne(+id));
  }

  @Delete(':id')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ id: 'id' }))
  async delete(@Body() deletePlaceDto: DeletePlaceDto): Promise<void> {
    await this.placesService.delete(deletePlaceDto);
  }
}

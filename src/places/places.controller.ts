import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { FileToBodyInterceptor } from 'src/support/interceptors/file-to-body.interceptor';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/roles.enum';
import { AddZoneDto } from './dto/add-zone.dto';
import { CreatePlaceDto } from './dto/create-place.dto';
import { DeletePlaceDto } from './dto/delete-place.dto';
import { DeleteZoneDto } from './dto/delete-zone.dto';
import { ReadPlaceDto } from './dto/read-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
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
  @UseInterceptors(FileInterceptor('image'), new FileToBodyInterceptor('image'), new JwtUserToBodyInterceptor())
  async create(@Body() createPlaceDto: CreatePlaceDto): Promise<ReadPlaceDto> {
    return plainToClass(ReadPlaceDto, await this.placesService.create(createPlaceDto));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadPlaceDto> {
    return plainToClass(ReadPlaceDto, await this.placesService.findOne(+id));
  }

  @Put(':id')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'), new FileToBodyInterceptor('image'), new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ id: 'id' }))
  async update(@Body() updatePlaceDto: UpdatePlaceDto): Promise<ReadPlaceDto> {
    return plainToClass(ReadPlaceDto, await this.placesService.update(updatePlaceDto));
  }

  @Post(':placeId/zones')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ placeId: 'placeId' }))
  async addZone(@Body() addZoneDto: AddZoneDto): Promise<ReadPlaceDto> {
    return plainToClass(ReadPlaceDto, await this.placesService.addZone(addZoneDto));
  }

  @Put(':placeId/zones/:zoneId')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ placeId: 'placeId', zoneId: 'zoneId' }))
  async updateZone(@Body() updateZoneDto: UpdateZoneDto): Promise<ReadPlaceDto> {
    return plainToClass(ReadPlaceDto, await this.placesService.updateZone(updateZoneDto));
  }

  @Delete(':placeId/zones/:zoneId')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ placeId: 'placeId', zoneId: 'zoneId' }))
  async deleteZone(@Body() deleteZoneDto: DeleteZoneDto): Promise<ReadPlaceDto> {
    return plainToClass(ReadPlaceDto, await this.placesService.deleteZone(deleteZoneDto));
  }

  @Delete(':id')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ id: 'id' }))
  async delete(@Body() deletePlaceDto: DeletePlaceDto): Promise<void> {
    await this.placesService.delete(deletePlaceDto);
  }
}

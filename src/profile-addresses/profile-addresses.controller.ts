import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationPipe } from 'src/support/pagination/pagination-pipe';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { CreateProfileAddressDto } from './dto/create-profile-address.dto';
import { ReadProfileAddressDto } from './dto/read-profile-address.dto';
import { UpdateProfileAddressDto } from './dto/update-profile-address.dto';
import { ProfileAddressPaginationPipe } from './pipes/profile-address-pagination.pipe';
import { ProfileAddressesService } from './profile-addresses.service';

@Controller('profile/addresses')
@UseGuards(JwtAuthGuard)
export class ProfileAddressesController {
  constructor(private readonly profileAddressesService: ProfileAddressesService) {}

  @Get()
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async paginate(
    @Query(ProfileAddressPaginationPipe) options: any,
    @Body('userId') userId: number
  ): Promise<PaginationResult<ReadProfileAddressDto>> {
    return (await this.profileAddressesService.paginate(options, userId)).toClass(ReadProfileAddressDto);
  }

  @Post()
  @UseInterceptors(new JwtUserToBodyInterceptor('user'))
  async create(@Body() createProfileAddressDto: CreateProfileAddressDto): Promise<ReadProfileAddressDto> {
    return plainToClass(ReadProfileAddressDto, await this.profileAddressesService.create(createProfileAddressDto));
  }

  @Get(':id')
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async findOne(
    @Param('id') id: string,
    @Body('userId') userId: number,
  ): Promise<ReadProfileAddressDto> {
    return plainToClass(ReadProfileAddressDto, await this.profileAddressesService.findOne(+id, userId));
  }

  @Put(':id')
  @UseInterceptors(new JwtUserToBodyInterceptor('user'), new ParamsToBodyInterceptor({id: 'id'}))
  async update(
    @Body() updateProfileAddressDto: UpdateProfileAddressDto,
  ): Promise<ReadProfileAddressDto> {
    return plainToClass(ReadProfileAddressDto, await this.profileAddressesService.update(updateProfileAddressDto));
  }

  @Delete(':id')
  @UseInterceptors(new JwtUserToBodyInterceptor())
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id') id: string,
    @Body('userId') userId: number,
  ): Promise<void> {
    return await this.profileAddressesService.delete(+id, userId);
  }
}

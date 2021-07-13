import { Body, Controller, Get, Param, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationPipe } from 'src/support/pagination/pagination-pipe';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Days, DaysValues } from 'src/support/types/days.enum';
import { Role } from 'src/users/enums/roles.enum';
import { ReadStoreHourDto } from './dto/read-store-hour.dto';
import { UpdateStoreHourDto } from './dto/update-store-hour.dto';
import { StoreHoursService } from './store-hours.service';

@Controller('store-hours')
export class StoreHoursController {
  constructor(private readonly storeHoursService: StoreHoursService) {}

  @Get()
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async paginate(
    @Query(PaginationPipe) options: PaginationOptions,
    @Body('userId') userId: number
  ): Promise<PaginationResult<ReadStoreHourDto>> {
    return (await this.storeHoursService.paginate(options, userId)).toClass(ReadStoreHourDto);
  }

  @Put(`:day(${DaysValues.join('|')})`)
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({day: 'day'}))
  async update(@Body() updateStoreHourDto: UpdateStoreHourDto): Promise<ReadStoreHourDto> {
    return plainToClass(ReadStoreHourDto, await this.storeHoursService.update(updateStoreHourDto));
  }

  @Get(`:day(${DaysValues.join('|')})`)
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async findOne(
    @Param('day') day: Days,
    @Body('userId') userId: number
  ): Promise<ReadStoreHourDto> {
    return plainToClass(ReadStoreHourDto, await this.storeHoursService.findOne(day, userId))
  }
}

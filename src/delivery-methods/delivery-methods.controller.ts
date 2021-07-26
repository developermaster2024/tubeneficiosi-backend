import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/roles.enum';
import { DeliveryMethodsService } from './delivery-methods.service';
import { CreateDeliveryMethodDto } from './dto/create-delivery-method.dto';
import { ReadDeliveryMethodDto } from './dto/read-delivery-method.dto';
import { UpdateDeliveryMethodDto } from './dto/update-delivery-method.dto';
import { DeliveryMethodPaginationPipe } from './pipes/delivery-method-pagination.pipe';

@Controller('delivery-methods')
export class DeliveryMethodsController {
  constructor(private readonly deliveryMethodsService: DeliveryMethodsService) {}

  @Get()
  async paginate(@Query(DeliveryMethodPaginationPipe) options: any): Promise<PaginationResult<ReadDeliveryMethodDto>> {
    return (await this.deliveryMethodsService.paginate(options)).toClass(ReadDeliveryMethodDto);
  }

  @Post()
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async create(@Body() createDeliveryMethodDto: CreateDeliveryMethodDto): Promise<any> {
    return await this.deliveryMethodsService.create(createDeliveryMethodDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadDeliveryMethodDto> {
    return plainToClass(ReadDeliveryMethodDto, await this.deliveryMethodsService.findOne(+id));
  }

  @Put(':id')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({id: 'id'}))
  async update(@Body() updateDeliveryMethodDto: UpdateDeliveryMethodDto): Promise<ReadDeliveryMethodDto> {
    return plainToClass(ReadDeliveryMethodDto, await this.deliveryMethodsService.update(updateDeliveryMethodDto));
  }

  @Delete(':id')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async delete(@Param('id') id: string, @Body('userId') userId: number): Promise<void> {
    await this.deliveryMethodsService.delete(+id, userId);
  }
}

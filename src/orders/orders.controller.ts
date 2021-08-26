import { Body, Controller, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/roles.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { ReadOrderDto } from './dto/read-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';
import { OrderPaginationPipe } from './pipes/order-pagination.pipe';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Roles(Role.CLIENT, Role.STORE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async paginate(
    @Query(OrderPaginationPipe) options: any,
    @Body('userId') userId: number
  ): Promise<PaginationResult<ReadOrderDto>> {
    return (await this.ordersService.paginate(options, userId)).toClass(ReadOrderDto);
  }

  @Post()
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async create(@Body() createOrderDto: CreateOrderDto): Promise<ReadOrderDto> {
    return plainToClass(ReadOrderDto, await this.ordersService.create(createOrderDto));
  }

  @Get(':id')
  @Roles(Role.CLIENT, Role.STORE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async findOne(
    @Param('id') id: string,
    @Body('userId') userId: number
  ): Promise<ReadOrderDto> {
    return plainToClass(ReadOrderDto, await this.ordersService.findOne(+id, userId));
  }

  @Put(':id/status')
  @Roles(Role.CLIENT, Role.STORE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ id: 'id' }))
  async updateStatus(@Body() updateOrderStatusDto: UpdateOrderStatusDto): Promise<ReadOrderDto> {
    return plainToClass(ReadOrderDto, await this.ordersService.updateOrderStatus(updateOrderStatusDto));
  }
}

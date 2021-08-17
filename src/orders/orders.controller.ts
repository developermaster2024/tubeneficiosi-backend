import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/users/enums/roles.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { ReadOrderDto } from './dto/read-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createOrderDto: CreateOrderDto): Promise<ReadOrderDto> {
    return plainToClass(ReadOrderDto, await this.ordersService.create(createOrderDto));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadOrderDto> {
    return plainToClass(ReadOrderDto, await this.ordersService.findOne(+id));
  }
}

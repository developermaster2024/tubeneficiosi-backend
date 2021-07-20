import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/users/enums/roles.enum';
import { DeliveryMethodsService } from './delivery-methods.service';
import { CreateDeliveryMethodDto } from './dto/create-delivery-method.dto';

@Controller('stores/:storeId/delivery-methods')
export class DeliveryMethodsController {
  constructor(private readonly deliveryMethodsService: DeliveryMethodsService) {}

  @Post()
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createDeliveryMethodDto: CreateDeliveryMethodDto): Promise<any> {
    return await this.deliveryMethodsService.create(createDeliveryMethodDto);
  }
}

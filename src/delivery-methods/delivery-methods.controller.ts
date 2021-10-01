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
import { DeliveryMethodsService } from './delivery-methods.service';
import { AddDeliveryRangeDto } from './dto/add-delivery-range.dto';
import { AddDeliveryZoneDto } from './dto/add-delivery-zone.dto';
import { AddShippingRangeDto } from './dto/add-shipping-range.dto';
import { CalculateCostDto } from './dto/calculate-cost.dto';
import { CreateDeliveryMethodDto } from './dto/create-delivery-method.dto';
import { DeleteDeliveryRangeDto } from './dto/delete-delivery-range.dto';
import { DeleteDeliveryZoneDto } from './dto/delete-delivery-zone.dto';
import { DeleteShippingRangeDto } from './dto/delete-shipping-range.dto';
import { ReadDeliveryMethodDto } from './dto/read-delivery-method.dto';
import { UpdateDeliveryMethodDto } from './dto/update-delivery-method.dto';
import { UpdateDeliveryRangeDto } from './dto/update-delivery-range.dto';
import { UpdateDeliveryZoneDto } from './dto/update-delivery-zone.dto';
import { UpdateShippingRangeDto } from './dto/update-shipping-range.dto';
import { UpdateZoneToDeliveryRangeDto } from './dto/update-zone-to-delivery-range.dto';
import { UpdateZoneToShippingRangeDto } from './dto/update-zone-to-shipping-range.dto';
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
  @UseInterceptors(FileInterceptor('image'), new FileToBodyInterceptor('image'), new JwtUserToBodyInterceptor())
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
  @UseInterceptors(FileInterceptor('image'), new FileToBodyInterceptor('image'), new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({id: 'id'}))
  async update(@Body() updateDeliveryMethodDto: UpdateDeliveryMethodDto): Promise<ReadDeliveryMethodDto> {
    return plainToClass(ReadDeliveryMethodDto, await this.deliveryMethodsService.update(updateDeliveryMethodDto));
  }

  @Post(':deliveryMethodId/shipping-ranges')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ deliveryMethodId: 'deliveryMethodId' }))
  async addShippingRange(@Body() addShippingRangeDto: AddShippingRangeDto): Promise<ReadDeliveryMethodDto> {
    return plainToClass(ReadDeliveryMethodDto, await this.deliveryMethodsService.addShippingRange(addShippingRangeDto));
  }

  @Put('shipping-ranges/:shippingRangeId')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ shippingRangeId: 'shippingRangeId' }))
  async updateShippingRange(@Body() updateShippingRangeDto: UpdateShippingRangeDto): Promise<ReadDeliveryMethodDto> {
    return plainToClass(ReadDeliveryMethodDto, await this.deliveryMethodsService.updateShippingRange(updateShippingRangeDto));
  }

  @Delete('shipping-ranges/:shippingRangeId')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ shippingRangeId: 'shippingRangeId' }))
  async deleteShippingRange(@Body() deleteShippingRangeDto: DeleteShippingRangeDto): Promise<ReadDeliveryMethodDto> {
    return plainToClass(ReadDeliveryMethodDto, await this.deliveryMethodsService.deleteShippingRange(deleteShippingRangeDto));
  }

  @Post(':deliveryMethodId/delivery-ranges')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ deliveryMethodId: 'deliveryMethodId' }))
  async addDeliveryRange(@Body() addDeliveryRangeDto: AddDeliveryRangeDto): Promise<ReadDeliveryMethodDto> {
    return plainToClass(ReadDeliveryMethodDto, await this.deliveryMethodsService.addDeliveryRange(addDeliveryRangeDto));
  }

  @Put('delivery-ranges/:deliveryRangeId')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ deliveryRangeId: 'deliveryRangeId' }))
  async updateDeliveryRange(@Body() updateDeliveryRangeDto: UpdateDeliveryRangeDto): Promise<ReadDeliveryMethodDto> {
    return plainToClass(ReadDeliveryMethodDto, await this.deliveryMethodsService.updateDeliveryRange(updateDeliveryRangeDto));
  }

  @Delete('delivery-ranges/:deliveryRangeId')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ deliveryRangeId: 'deliveryRangeId' }))
  async deleteDeliveryRange(@Body() deleteDeliveryRangeDto: DeleteDeliveryRangeDto): Promise<ReadDeliveryMethodDto> {
    return plainToClass(ReadDeliveryMethodDto, await this.deliveryMethodsService.deleteDeliveryRange(deleteDeliveryRangeDto));
  }

  @Put('zone-to-shipping-ranges/:zoneToShippingRangeId')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ zoneToShippingRangeId: 'zoneToShippingRangeId' }))
  async updateZoneToShippingRange(@Body() updateZoneToShippingRangeDto: UpdateZoneToShippingRangeDto): Promise<ReadDeliveryMethodDto> {
    return plainToClass(ReadDeliveryMethodDto, await this.deliveryMethodsService.updateZoneToShippingRange(updateZoneToShippingRangeDto));
  }

  @Put('zone-to-delivery-ranges/:zoneToDeliveryRangeId')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ zoneToDeliveryRangeId: 'zoneToDeliveryRangeId' }))
  async updateZoneToDeliveryRange(@Body() updateZoneToDeliveryRangeDto: UpdateZoneToDeliveryRangeDto): Promise<ReadDeliveryMethodDto> {
    return plainToClass(ReadDeliveryMethodDto, await this.deliveryMethodsService.updateZoneToDeliveryRange(updateZoneToDeliveryRangeDto));
  }

  @Post(':deliveryMethodId/delivery-zones')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ deliveryMethodId: 'deliveryMethodId' }))
  async addDeliveryZone(@Body() addDeliveryZoneDto: AddDeliveryZoneDto): Promise<ReadDeliveryMethodDto> {
    return plainToClass(ReadDeliveryMethodDto, await this.deliveryMethodsService.addDeliveryZone(addDeliveryZoneDto));
  }

  @Put('delivery-zones/:deliveryZoneId')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ deliveryZoneId: 'deliveryZoneId' }))
  async updateDeliveryZone(@Body() updateDeliveryZoneDto: UpdateDeliveryZoneDto): Promise<ReadDeliveryMethodDto> {
    return plainToClass(ReadDeliveryMethodDto, await this.deliveryMethodsService.updateDeliveryZone(updateDeliveryZoneDto));
  }

  @Delete('delivery-zones/:deliveryZoneId')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ deliveryZoneId: 'deliveryZoneId' }))
  async deleteDeliveryZone(@Body() deleteDeliveryZoneDto: DeleteDeliveryZoneDto): Promise<ReadDeliveryMethodDto> {
    return plainToClass(ReadDeliveryMethodDto, await this.deliveryMethodsService.deleteDeliveryZone(deleteDeliveryZoneDto));
  }

  @Delete(':id')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async delete(@Param('id') id: string, @Body('userId') userId: number): Promise<void> {
    await this.deliveryMethodsService.delete(+id, userId);
  }

  @Post('calculate-cost')
  async calculateCost(@Body() calculateCostDto: CalculateCostDto): Promise<{cost: number}> {
    return await this.deliveryMethodsService.calculateCost(calculateCostDto);
  }
}

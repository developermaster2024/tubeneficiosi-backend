import { Module } from '@nestjs/common';
import { DeliveryMethodTypesService } from './delivery-method-types.service';
import { DeliveryMethodTypesController } from './delivery-method-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryMethodType } from './entities/delivery-method-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliveryMethodType]),
  ],
  providers: [DeliveryMethodTypesService],
  controllers: [DeliveryMethodTypesController]
})
export class DeliveryMethodTypesModule {}

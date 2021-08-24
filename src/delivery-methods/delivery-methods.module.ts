import { Module } from '@nestjs/common';
import { DeliveryMethodsService } from './delivery-methods.service';
import { DeliveryMethodsController } from './delivery-methods.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryMethod } from './entities/delivery-method.entity';
import { Location } from 'src/locations/entities/location.entity';
import { DeliveryZoneToShippingRange } from './entities/delivery-zone-to-shipping-range.entity';
import { DeliveryZoneToDeliveryRange } from './entities/delivery-zone-to-delivery-range.entity';
import { Store } from 'src/stores/entities/store.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { filenameGenerator } from 'src/support/file-uploads';
import { DeliveryZone } from './entities/delivery-zone.entity';
import { Cart } from 'src/carts/entities/cart.entity';
import { ShippingCostCalculator } from './support/shipping-cost-calculator';
import { ShippingRange } from './entities/shipping-range.entity';
import { DeliveryCostCalculator } from './support/delivery-cost-calculator';
import { DeliveryRange } from './entities/delivery-range.entity';
import { DeliveryCostCalculatorResolver } from './support/delivery-cost-calculator-resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeliveryMethod,
      DeliveryZone,
      ShippingRange,
      DeliveryRange,
      DeliveryZoneToShippingRange,
      DeliveryZoneToDeliveryRange,
      Location,
      Store,
      Cart,
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/delivery-methods',
        filename: filenameGenerator,
      })
    }),
  ],
  providers: [DeliveryMethodsService, ShippingCostCalculator, DeliveryCostCalculator, DeliveryCostCalculatorResolver],
  controllers: [DeliveryMethodsController],
  exports: [DeliveryCostCalculatorResolver]
})
export class DeliveryMethodsModule {}

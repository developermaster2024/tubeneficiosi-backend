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

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliveryMethod, Location, DeliveryZoneToShippingRange, DeliveryZoneToDeliveryRange, Store]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/delivery-methods',
        filename: filenameGenerator,
      })
    }),
  ],
  providers: [DeliveryMethodsService],
  controllers: [DeliveryMethodsController]
})
export class DeliveryMethodsModule {}

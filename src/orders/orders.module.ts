import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { Cart } from 'src/carts/entities/cart.entity';
import { DeliveryMethodsModule } from 'src/delivery-methods/delivery-methods.module';
import { DeliveryMethod } from 'src/delivery-methods/entities/delivery-method.entity';
import { DeliveryZone } from 'src/delivery-methods/entities/delivery-zone.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { OrderStatus } from 'src/order-statuses/entities/order-status.entity';
import { PaymentGatewaysModule } from 'src/payment-gateways/payment-gateways.module';
import { ProductDetails } from 'src/products/entities/product-details.entity';
import { Product } from 'src/products/entities/product.entity';
import { ShowToZone } from 'src/shows/entities/show-to-zone.entity';
import { filenameGenerator } from 'src/support/file-uploads';
import { User } from 'src/users/entities/user.entity';
import { Order } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Cart, DeliveryZone, User, Product, ProductDetails, DeliveryMethod, OrderStatus, Notification, ShowToZone]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/orders',
        filename: filenameGenerator,
      })
    }),
    PaymentGatewaysModule,
    DeliveryMethodsModule,
    NotificationsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/carts/entities/cart.entity';
import { DeliveryMethodsModule } from 'src/delivery-methods/delivery-methods.module';
import { DeliveryMethod } from 'src/delivery-methods/entities/delivery-method.entity';
import { DeliveryZone } from 'src/delivery-methods/entities/delivery-zone.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { OrderStatus } from 'src/order-statuses/entities/order-status.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Order } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Cart, DeliveryZone, User, Product, DeliveryMethod, OrderStatus, Notification]),
    DeliveryMethodsModule,
    NotificationsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}

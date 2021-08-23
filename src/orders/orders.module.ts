import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/carts/entities/cart.entity';
import { DeliveryZone } from 'src/delivery-methods/entities/delivery-zone.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Order } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Cart, DeliveryZone, User, Product])],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { Store } from 'src/stores/entities/store.entity';
import { ProductRating } from './entities/product-rating.entity';
import { ProductRatingsController } from './product-ratings.controller';
import { ProductRatingsService } from './product-ratings.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductRating, Order, Product, Store])],
  controllers: [ProductRatingsController],
  providers: [ProductRatingsService]
})
export class ProductRatingsModule {}

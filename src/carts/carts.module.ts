import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductFeature } from 'src/product-features/entities/product-feature.entity';
import { ProductFeatureForGroup } from 'src/products/entities/product-feature-for-group.entity';
import { Product } from 'src/products/entities/product.entity';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { CartItem } from './entities/cart-item.entity';
import { Cart } from './entities/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Product, ProductFeature, ProductFeatureForGroup])],
  controllers: [CartsController],
  providers: [CartsService]
})
export class CartsModule {}

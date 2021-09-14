import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteProduct } from './entities/favorite-product.entity';
import { FavoriteProductsController } from './favorite-products.controller';
import { FavoriteProductsService } from './favorite-products.service';

@Module({
  imports: [TypeOrmModule.forFeature([FavoriteProduct])],
  controllers: [FavoriteProductsController],
  providers: [FavoriteProductsService]
})
export class FavoriteProductsModule {}

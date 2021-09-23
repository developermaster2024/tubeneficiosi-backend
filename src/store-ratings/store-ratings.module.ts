import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { Store } from 'src/stores/entities/store.entity';
import { StoreRating } from './entities/store-rating.entity';
import { StoreRatingsController } from './store-ratings.controller';
import { StoreRatingsService } from './store-ratings.service';

@Module({
  imports: [TypeOrmModule.forFeature([StoreRating, Order, Store])],
  controllers: [StoreRatingsController],
  providers: [StoreRatingsService]
})
export class StoreRatingsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ad } from 'src/ads/entities/ad.entity';
import { Client } from 'src/clients/entities/client.entity';
import { FeaturedAd } from 'src/featured-ads/entities/featured-ad.entity';
import { MainBannerAd } from 'src/main-banner-ads/entities/main-banner-ad.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { StoreAd } from 'src/store-ads/entities/store-ad.entity';
import { Store } from 'src/stores/entities/store.entity';
import { SummariesController } from './summaries.controller';
import { SummariesService } from './summaries.service';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Store, Order, Product, Ad, FeaturedAd, MainBannerAd, StoreAd])],
  controllers: [SummariesController],
  providers: [SummariesService]
})
export class SummariesModule {}

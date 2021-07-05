import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreAd } from './entities/store-ad.entity';
import { StoreAdsController } from './store-ads.controller';
import { StoreAdsService } from './store-ads.service';

@Module({
  imports: [TypeOrmModule.forFeature([StoreAd])],
  controllers: [StoreAdsController],
  providers: [StoreAdsService]
})
export class StoreAdsModule {}

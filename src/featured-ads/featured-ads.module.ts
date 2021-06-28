import { Module } from '@nestjs/common';
import { FeaturedAdsService } from './featured-ads.service';
import { FeaturedAdsController } from './featured-ads.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeaturedAd } from './entities/featured-ad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeaturedAd])],
  providers: [FeaturedAdsService],
  controllers: [FeaturedAdsController]
})
export class FeaturedAdsModule {}

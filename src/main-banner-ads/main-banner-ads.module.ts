import { Module } from '@nestjs/common';
import { MainBannerAdsService } from './main-banner-ads.service';
import { MainBannerAdsController } from './main-banner-ads.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainBannerAd } from './entities/main-banner-ad.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { filenameGenerator } from 'src/support/file-uploads';

@Module({
  imports: [
    TypeOrmModule.forFeature([MainBannerAd]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/main-banner-ads',
        filename: filenameGenerator,
      })
    }),
  ],
  providers: [MainBannerAdsService],
  controllers: [MainBannerAdsController]
})
export class MainBannerAdsModule {}

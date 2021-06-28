import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ValidationModule } from './validation/validation.module';
import { SupportModule } from './support/support.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { ProfileAddressesModule } from './profile-addresses/profile-addresses.module';
import { StoresProfileModule } from './stores-profile/stores-profile.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';
import { BrandsModule } from './brands/brands.module';
import { HelpCategoriesModule } from './help-categories/help-categories.module';
import { HelpsModule } from './helps/helps.module';
import { SettingsModule } from './settings/settings.module';
import { LocationsModule } from './locations/locations.module';
import { NotificationsModule } from './notifications/notifications.module';
import { QuestionsModule } from './questions/questions.module';
import { ProductsModule } from './products/products.module';
import { ProductFeaturesModule } from './product-features/product-features.module';
import { MainBannerAdsModule } from './main-banner-ads/main-banner-ads.module';
import { AdsPositionsModule } from './ads-positions/ads-positions.module';
import { AdsModule } from './ads/ads.module';
import { FeaturedAdsModule } from './featured-ads/featured-ads.module';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ValidationModule,
    SupportModule,
    AuthModule,
    ProfileModule,
    ProfileAddressesModule,
    StoresProfileModule,
    CategoriesModule,
    TagsModule,
    BrandsModule,
    HelpCategoriesModule,
    HelpsModule,
    SettingsModule,
    LocationsModule,
    NotificationsModule,
    QuestionsModule,
    ProductsModule,
    ProductFeaturesModule,
    MainBannerAdsModule,
    AdsPositionsModule,
    AdsModule,
    FeaturedAdsModule,
  ],
})
export class AppModule {}

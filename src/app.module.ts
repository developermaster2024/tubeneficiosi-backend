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
import { MainBannerAdsModule } from './main-banner-ads/main-banner-ads.module';
import { AdsPositionsModule } from './ads-positions/ads-positions.module';
import { AdsModule } from './ads/ads.module';
import { FeaturedAdsModule } from './featured-ads/featured-ads.module';
import { ClientsModule } from './clients/clients.module';
import { StoresModule } from './stores/stores.module';
import { CardIssuersModule } from './card-issuers/card-issuers.module';
import { BankAccountTypesModule } from './bank-account-types/bank-account-types.module';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { StoreAdsModule } from './store-ads/store-ads.module';
import { StoreCategoriesModule } from './store-categories/store-categories.module';
import { CartsModule } from './carts/carts.module';
import { StoreHoursModule } from './store-hours/store-hours.module';
import { UserStatusesModule } from './user-statuses/user-statuses.module';
import { DeliveryMethodsModule } from './delivery-methods/delivery-methods.module';
import { MailModule } from './mail/mail.module';
import { DeliveryMethodTypesModule } from './delivery-method-types/delivery-method-types.module';
import { CardTypesModule } from './card-types/card-types.module';
import { CardsModule } from './cards/cards.module';
import { OrderStatusesModule } from './order-statuses/order-statuses.module';
import { CardIssuerTypesModule } from './card-issuer-types/card-issuer-types.module';
import { BankAccountPurposesModule } from './bank-account-purposes/bank-account-purposes.module';
import { OrdersModule } from './orders/orders.module';
import { DeliveryNotesModule } from './delivery-notes/delivery-notes.module';
import { DiscountTypesModule } from './discount-types/discount-types.module';
import { DiscountsModule } from './discounts/discounts.module';
import { FavoriteProductsModule } from './favorite-products/favorite-products.module';
import { FavoriteStoresModule } from './favorite-stores/favorite-stores.module';
import { ProductRatingsModule } from './product-ratings/product-ratings.module';
import { PaymentGatewaysModule } from './payment-gateways/payment-gateways.module';
import { StoreRatingsModule } from './store-ratings/store-ratings.module';
import { ClientCardsModule } from './client-cards/client-cards.module';
import { StoreFeaturesModule } from './store-features/store-features.module';
import { PlacesModule } from './places/places.module';
import { ShowsModule } from './shows/shows.module';
import { NewsModule } from './news/news.module';
import { CountriesModule } from './countries/countries.module';
import { SummariesModule } from './summaries/summaries.module';

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
    MainBannerAdsModule,
    AdsPositionsModule,
    AdsModule,
    FeaturedAdsModule,
    ClientsModule,
    StoresModule,
    CardIssuersModule,
    BankAccountTypesModule,
    BankAccountsModule,
    PaymentMethodsModule,
    StoreAdsModule,
    StoreCategoriesModule,
    CartsModule,
    StoreHoursModule,
    UserStatusesModule,
    DeliveryMethodsModule,
    MailModule,
    DeliveryMethodTypesModule,
    CardTypesModule,
    CardsModule,
    OrderStatusesModule,
    CardIssuerTypesModule,
    BankAccountPurposesModule,
    OrdersModule,
    DeliveryNotesModule,
    DiscountTypesModule,
    DiscountsModule,
    FavoriteProductsModule,
    FavoriteStoresModule,
    ProductRatingsModule,
    PaymentGatewaysModule,
    StoreRatingsModule,
    ClientCardsModule,
    StoreFeaturesModule,
    PlacesModule,
    ShowsModule,
    NewsModule,
    CountriesModule,
    SummariesModule,
  ],
})
export class AppModule {}

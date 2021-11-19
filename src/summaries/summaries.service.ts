import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from 'src/ads/entities/ad.entity';
import { Client } from 'src/clients/entities/client.entity';
import { FeaturedAd } from 'src/featured-ads/entities/featured-ad.entity';
import { MainBannerAd } from 'src/main-banner-ads/entities/main-banner-ad.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { StoreAd } from 'src/store-ads/entities/store-ad.entity';
import { Store } from 'src/stores/entities/store.entity';
import { UserStatuses } from 'src/users/enums/user-statuses.enum';
import { Repository } from 'typeorm';
import { ClientsSummaryDto } from './dto/clients-summary.dto';
import { DashboardSummaryDto } from './dto/dashboard-summary.dto';

@Injectable()
export class SummariesService {
  constructor(
    @InjectRepository(Client) private readonly clientsRepository: Repository<Client>,
    @InjectRepository(Store) private readonly storesRepository: Repository<Store>,
    @InjectRepository(Order) private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Product) private readonly productsRepository: Repository<Product>,
    @InjectRepository(Ad) private readonly adsRepository: Repository<Ad>,
    @InjectRepository(FeaturedAd) private readonly featuredAdsRepository: Repository<FeaturedAd>,
    @InjectRepository(MainBannerAd) private readonly mainBannerAdsRepository: Repository<MainBannerAd>,
    @InjectRepository(StoreAd) private readonly storeAdsRepository: Repository<StoreAd>
  ) {}

  async dashboardSummary(): Promise<DashboardSummaryDto> {
    const clientsCount = await this.clientsRepository.createQueryBuilder('client').getCount();
    const storesCount = await this.storesRepository.createQueryBuilder('store').getCount();
    const ordersCount = await this.ordersRepository.createQueryBuilder('order').getCount();
    const productsCount = await this.productsRepository.createQueryBuilder('product').getCount();
    const adsCount = await this.adsRepository.createQueryBuilder('ad').getCount();
    const featuredAdsCount = await this.featuredAdsRepository.createQueryBuilder('featuredAd').getCount();
    const mainBannerAdsCount = await this.mainBannerAdsRepository.createQueryBuilder('mainBannerAd').getCount();
    const storeAdsCount = await this.storeAdsRepository.createQueryBuilder('storeAd').getCount();

    return {
      clientsCount,
      storesCount,
      ordersCount,
      productsCount,
      adsCount: adsCount + featuredAdsCount + mainBannerAdsCount + storeAdsCount,
    };
  }

  async clientsSummary(): Promise<ClientsSummaryDto> {
    const clientsCount = await this.clientsRepository.createQueryBuilder('client').getCount();
    const activeClientsCount = await this.clientsRepository.createQueryBuilder('client')
      .innerJoin('client.user', 'user', 'user.userStatusCode = :userStatusCode', { userStatusCode: UserStatuses.ACTIVE })
      .getCount();
    const bannedClientsCount = await this.clientsRepository.createQueryBuilder('client')
      .innerJoin('client.user', 'user', 'user.userStatusCode = :userStatusCode', { userStatusCode: UserStatuses.BANNED })
      .getCount();

    return {
      clientsCount,
      activeClientsCount,
      bannedClientsCount,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ad } from 'src/ads/entities/ad.entity';
import { Client } from 'src/clients/entities/client.entity';
import { Discount } from 'src/discounts/entities/discount.entity';
import { FeaturedAd } from 'src/featured-ads/entities/featured-ad.entity';
import { MainBannerAd } from 'src/main-banner-ads/entities/main-banner-ad.entity';
import { OrderStatuses } from 'src/order-statuses/enums/order-statuses.enum';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { StoreAd } from 'src/store-ads/entities/store-ad.entity';
import { Store } from 'src/stores/entities/store.entity';
import { Tag } from 'src/tags/entities/tag.entity';
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
    @InjectRepository(StoreAd) private readonly storeAdsRepository: Repository<StoreAd>,
    @InjectRepository(Tag) private readonly tagsRepository: Repository<Tag>,
    @InjectRepository(Discount) private readonly discountsRepository: Repository<Discount>
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

  async tagsSummary(): Promise<{ emptyTagsCount: number; bestTag: Tag; averageProductsPerTag: number; }> {
    const emptyTagsCount = await this.tagsRepository.createQueryBuilder('tag')
      .where('NOT EXISTS (SELECT tag_id FROM product_to_tag WHERE tag_id = id)')
      .getCount();

    const bestTag = await this.tagsRepository.createQueryBuilder('tag')
      .addSelect('(SELECT COUNT(tag_id) FROM product_to_tag WHERE tag_id = id)', 'products_count')
      .orderBy('products_count', 'DESC')
      .getOne();

    const { averageProductsPerTag } = await this.tagsRepository.createQueryBuilder('tag')
      .select('(AVG((SELECT COUNT(tag_id) FROM product_to_tag WHERE tag_id = id)))', 'averageProductsPerTag')
      .getRawOne<{ averageProductsPerTag: string }>();

    return {
      emptyTagsCount,
      bestTag,
      averageProductsPerTag: +averageProductsPerTag,
    };
  }

  async discountsSummary(): Promise<{ discountsCount: number; bestDiscount: Discount; storeWithMoreDiscounts: Store; }> {
    const discountsCount = await this.discountsRepository.createQueryBuilder('discount')
      .getCount();

    const storeWithMoreDiscounts = await this.storesRepository.createQueryBuilder('store')
      .innerJoin('store.storeProfile', 'storeProfile')
      .addSelect('(SELECT COUNT(discounts.id) FROM discounts WHERE discounts.store_id = store.id AND discounts.deleted_at IS NULL)', 'discounts_count')
      .orderBy('discounts_count', 'DESC')
      .getOne();

    const bestDiscount = await this.discountsRepository.createQueryBuilder('discount')
      .addSelect(`(
        SELECT
          COUNT(orders.id)
        FROM
          orders
        INNER JOIN
          carts ON carts.id = orders.cart_id
        WHERE
          carts.discount_id = discount.id AND orders.order_status_code = '${OrderStatuses.PRODUCTS_RECEIVED}' AND orders.deleted_at IS NULL
      )`, 'orders_count')
      .orderBy('orders_count', 'DESC')
      .getOne();

    return {
      discountsCount,
      bestDiscount,
      storeWithMoreDiscounts,
    };
  }

  async storeDiscountsSummary(userId: number): Promise<{
    bestDiscount: Discount;
    ordersCount: number;
  }> {
    const bestDiscount = await this.discountsRepository.createQueryBuilder('discount')
      .addSelect(`(
        SELECT
          COUNT(orders.id)
        FROM
          orders
        INNER JOIN
          carts ON carts.id = orders.cart_id
        WHERE
          carts.discount_id = discount.id AND orders.order_status_code = '${OrderStatuses.PRODUCTS_RECEIVED}' AND orders.deleted_at IS NULL
      )`, 'orders_count')
      .innerJoin('discount.store', 'store')
      .where('store.userId = :userId', { userId })
      .orderBy('orders_count', 'DESC')
      .getOne();

    const ordersCount = await this.ordersRepository.createQueryBuilder('order')
      .innerJoin('order.store', 'store')
      .innerJoin('order.cart', 'cart')
      .where('store.userId = :userId', { userId })
      .andWhere('cart.discountId = :discountId', { discountId: bestDiscount?.id ?? 0 })
      .getCount();

    return {
      bestDiscount: bestDiscount || null,
      ordersCount,
    };
  }
}

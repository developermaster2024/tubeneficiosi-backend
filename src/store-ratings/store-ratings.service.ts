import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatuses } from 'src/order-statuses/enums/order-statuses.enum';
import { Order } from 'src/orders/entities/order.entity';
import { OrderNotFoundException } from 'src/orders/errors/order-not-found.exception';
import { Store } from 'src/stores/entities/store.entity';
import { Repository } from 'typeorm';
import { RateStoreDto } from './dto/rate-store.dto';
import { StoreRating } from './entities/store-rating.entity';
import { StoreAlreadyRatedException } from './errors/store-already-rated.exception';

@Injectable()
export class StoreRatingsService {
  constructor(
    @InjectRepository(StoreRating) private readonly storeRatingsRepository: Repository<StoreRating>,
    @InjectRepository(Order) private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Store) private readonly storesRepository: Repository<Store>
  ) {}

  async rateStore({storeId, userId, orderId, ...rateStoreDto}: RateStoreDto): Promise<StoreRating> {
    const order = await this.ordersRepository.createQueryBuilder('order')
      .innerJoin('order.cart', 'cart')
      .where('order.id = :orderId', { orderId })
      .andWhere('order.userId = :userId', { userId })
      .andWhere('order.orderStatusCode = :orderStatusCode', { orderStatusCode: OrderStatuses.PRODUCTS_RECEIVED })
      .andWhere(`order.storeId = :storeId`, { storeId })
      .getOne();

    if (!order) throw new OrderNotFoundException();

    const existingStoreRating = await this.storeRatingsRepository.createQueryBuilder('storeRating')
      .where('storeRating.userId = :userId', { userId })
      .andWhere('storeRating.orderId = :orderId', { orderId })
      .andWhere('storeRating.storeId = :storeId', { storeId })
      .getOne();

    if (existingStoreRating) throw new StoreAlreadyRatedException();

    const storeRating = StoreRating.create({ storeId, userId, orderId, ...rateStoreDto });

    const savedRating = await this.storeRatingsRepository.save(storeRating);

    await this.storesRepository.createQueryBuilder('store')
      .update(Store)
      .set({
        rating: () => `(
          SELECT
            ROUND(AVG(value))
          FROM
            store_ratings
          WHERE
            store_ratings.store_id = stores.id
        )`
      })
      .where('id = :storeId', { storeId })
      .execute();

    return savedRating;
  }
}

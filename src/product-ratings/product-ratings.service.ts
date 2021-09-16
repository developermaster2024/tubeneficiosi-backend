import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatuses } from 'src/order-statuses/enums/order-statuses.enum';
import { Order } from 'src/orders/entities/order.entity';
import { OrderNotFoundException } from 'src/orders/errors/order-not-found.exception';
import { Repository } from 'typeorm';
import { RateProductDto } from './dto/rate-product.dto';
import { ProductRating } from './entities/product-rating.entity';
import { ProductAlreadyRatedException } from './errors/product-already-rated.exception';

@Injectable()
export class ProductRatingsService {
  constructor(
    @InjectRepository(ProductRating) private readonly productRatingsRepository: Repository<ProductRating>,
    @InjectRepository(Order) private readonly ordersReposiory: Repository<Order>
  ) {}

  async rateProduct({productId, userId, orderId, ...rateProductDto}: RateProductDto): Promise<ProductRating> {
    const order = await this.ordersReposiory.createQueryBuilder('order')
      .innerJoin('order.cart', 'cart')
      .where('order.id = :orderId', { orderId })
      .andWhere('order.userId = :userId', { userId })
      .andWhere('order.orderStatusCode = :orderStatusCode', { orderStatusCode: OrderStatuses.PRODUCTS_RECEIVED })
      .andWhere(`EXISTS(
        SELECT cartItem.id
        FROM cart_items cartItem
        WHERE cartItem.cart_id = cart.id AND cartItem.product_id = :productId
      )`, { productId })
      .getOne();

    if (!order) throw new OrderNotFoundException();

    const existingProductRating = await this.productRatingsRepository.createQueryBuilder('productRating')
      .where('productRating.userId = :userId', { userId })
      .andWhere('productRating.orderId = :orderId', { orderId })
      .andWhere('productRating.productId = :productId', { productId })
      .getOne();

    if (existingProductRating) {
      throw new ProductAlreadyRatedException();
    }

    const productRating = ProductRating.create({ orderId, productId, userId, ...rateProductDto });

    return await this.productRatingsRepository.save(productRating);
  }
}

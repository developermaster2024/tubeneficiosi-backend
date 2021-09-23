import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatuses } from 'src/order-statuses/enums/order-statuses.enum';
import { Order } from 'src/orders/entities/order.entity';
import { OrderNotFoundException } from 'src/orders/errors/order-not-found.exception';
import { Product } from 'src/products/entities/product.entity';
import { ProductNotFoundException } from 'src/products/errors/product-not-found.exception';
import { Store } from 'src/stores/entities/store.entity';
import { Repository } from 'typeorm';
import { RateProductDto } from './dto/rate-product.dto';
import { ProductRating } from './entities/product-rating.entity';
import { ProductAlreadyRatedException } from './errors/product-already-rated.exception';

@Injectable()
export class ProductRatingsService {
  constructor(
    @InjectRepository(ProductRating) private readonly productRatingsRepository: Repository<ProductRating>,
    @InjectRepository(Order) private readonly ordersReposiory: Repository<Order>,
    @InjectRepository(Product) private readonly productsRepository: Repository<Product>
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

    const savedRating = await this.productRatingsRepository.save(productRating);

    await this.productsRepository.createQueryBuilder('product')
      .update(Product)
      .set({
        rating: () => `(
          SELECT
            ROUND(AVG(value))
          FROM
            product_ratings
          WHERE
            product_ratings.product_id = products.id
        )`
      })
      .where('id = :productId', { productId })
      .execute();

    return savedRating;
  }
}

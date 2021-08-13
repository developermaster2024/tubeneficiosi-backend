import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductFeature } from 'src/product-features/entities/product-feature.entity';
import { ProductFeatureForGroup } from 'src/products/entities/product-feature-for-group.entity';
import { Product } from 'src/products/entities/product.entity';
import { ProductNotFoundException } from 'src/products/errors/product-not-found.exception';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { In, Repository } from 'typeorm';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CartItemFeature } from './entities/cart-item-feature.entity';
import { CartItem } from './entities/cart-item.entity';
import { Cart } from './entities/cart.entity';
import { CartNotFoundException } from './errors/cart-not-found.exception';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart) private readonly cartsRepository: Repository<Cart>,
    @InjectRepository(Product) private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductFeature) private readonly productFeaturesRepository: Repository<ProductFeature>,
    @InjectRepository(ProductFeatureForGroup) private readonly productFeatureForGroupsRepository: Repository<ProductFeatureForGroup>
  ) {}

  async paginate({offset, perPage}: PaginationOptions, userId: number): Promise<PaginationResult<Cart>> {
    const [carts, total] = await this.cartsRepository.findAndCount({
      take: perPage,
      skip: offset,
      where: {userId, isProcessed: 0},
      relations: ['cartItems', 'cartItems.product'],
    });

    return new PaginationResult(carts, total, perPage);
  }

  async addToCart({userId, storeId, productId, quantity, productFeaturesData}: AddToCartDto): Promise<Cart> {
    const featureIds = productFeaturesData?.featureIds ?? [];
    const featureForGroupIds = productFeaturesData?.featureForGroupIds ?? [];

    const product = await this.productsRepository.findOne(productId);

    if (!product) {
      throw new ProductNotFoundException();
    }

    let cart = await this.cartsRepository.findOne({
      where: {userId, storeId, isProcessed: 0},
      relations: ['cartItems', 'cartItems.product'],
    });

    if (!cart) {
      cart = Cart.create({
        userId,
        storeId,
        isProcessed: false,
        cartItems: [],
      });
    }

    const cartItem = cart.cartItems.find(cartItem => cartItem.productId === Number(productId));

    if (cartItem) {
      // @TODO: Problema con las características cuando se actualiza con un producto cuyas características seleccionadas son las mismas
      cartItem.quantity += quantity;
    } else {
      cart.cartItems.push(CartItem.create({
        product,
        quantity,
        cartItemFeatures: [
          ...(await this.productFeaturesRepository.find({ id: In(featureIds) }))
            .map(({name, value, price}) => CartItemFeature.create({name, value, price})),

          ...(await this.productFeatureForGroupsRepository.find({ id: In(featureForGroupIds) }))
            .map(({name, value, price}) => CartItemFeature.create({name, value, price})),
        ]
      }));
    }

    return await this.cartsRepository.save(cart);
  }

  async findOneStoreId(userId: number, storeId: number): Promise<Cart> {
    const cart = await this.cartsRepository.findOne({
      where: {userId, storeId, isProcessed: 0},
      relations: ['cartItems', 'cartItems.product', 'cartItems.cartItemFeatures'],
    });

    if (!cart) {
      throw new CartNotFoundException();
    }

    return cart;
  }
}

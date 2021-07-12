import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { ProductNotFoundException } from 'src/products/errors/product-not-found.exception';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CartItem } from './entities/cart-item.entity';
import { Cart } from './entities/cart.entity';
import { CartNotFoundException } from './errors/cart-not-found.exception';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart) private readonly cartsRepository: Repository<Cart>,
    @InjectRepository(Product) private readonly productsRepository: Repository<Product>
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

  async addToCart({userId, storeId, productId, quantity}: AddToCartDto): Promise<Cart> {
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
      cartItem.quantity += quantity;
    } else {
      cart.cartItems.push(CartItem.create({product, quantity}));
    }

    return await this.cartsRepository.save(cart);
  }

  async findOneStoreId(userId: number, storeId: number): Promise<Cart> {
    const cart = await this.cartsRepository.findOne({
      where: {userId, storeId, isProcessed: 0},
      relations: ['cartItems', 'cartItems.product'],
    });

    if (!cart) {
      throw new CartNotFoundException();
    }

    return cart;
  }
}

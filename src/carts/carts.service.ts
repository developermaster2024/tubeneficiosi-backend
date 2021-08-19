import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { add } from 'date-fns';
import { ProductFeature } from 'src/product-features/entities/product-feature.entity';
import { ProductFeatureForGroup } from 'src/products/entities/product-feature-for-group.entity';
import { Product } from 'src/products/entities/product.entity';
import { ProductNotFoundException } from 'src/products/errors/product-not-found.exception';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { In, Repository } from 'typeorm';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { DeleteCartitemDto } from './dto/delete-cart-item.dto';
import { UpdateCartItemQuantityDto } from './dto/update-cart-item-quantity.dto';
import { CartItemFeature } from './entities/cart-item-feature.entity';
import { CartItem } from './entities/cart-item.entity';
import { Cart } from './entities/cart.entity';
import { CartItemNotFoundException } from './errors/cart-item-not-found.exception';
import { CartNotFoundException } from './errors/cart-not-found.exception';
import { ProductQuantityIsLessThanRequiredQuantityException } from './errors/product-quantity-is-less-than-required-quantity.exception';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart) private readonly cartsRepository: Repository<Cart>,
    @InjectRepository(CartItem) private readonly cartItemsRepository: Repository<CartItem>,
    @InjectRepository(Product) private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductFeature) private readonly productFeaturesRepository: Repository<ProductFeature>,
    @InjectRepository(ProductFeatureForGroup) private readonly productFeatureForGroupsRepository: Repository<ProductFeatureForGroup>
  ) {}

  async paginate({offset, perPage}: PaginationOptions, userId: number): Promise<PaginationResult<Cart>> {
    const [carts, total] = await this.cartsRepository.findAndCount({
      take: perPage,
      skip: offset,
      where: {userId, isProcessed: 0},
      relations: ['cartItems', 'cartItems.product', 'cartItems.cartItemFeatures'],
    });

    return new PaginationResult(carts, total, perPage);
  }

  async addToCart({userId, storeId, productId, quantity, productFeaturesData, isDirectPurchase}: AddToCartDto): Promise<Cart> {
    const featureIds = productFeaturesData?.featureIds ?? [];
    const featureForGroupIds = productFeaturesData?.featureForGroupIds ?? [];

    const product = await this.productsRepository.findOne({
      where: { id: productId, storeId },
      relations: ['productImages'],
    });

    if (!product) {
      throw new ProductNotFoundException();
    }

    let cart: Cart;

    if (!isDirectPurchase) {
      cart = await this.cartsRepository.createQueryBuilder('cart')
        .leftJoinAndSelect('cart.cartItems', 'cartItem')
        .leftJoinAndSelect('cartItem.cartItemFeatures', 'cartItemFeature')
        .where('cart.userId = :userId', { userId })
        .andWhere('cart.storeId = :storeId', { storeId })
        .andWhere('cart.isProcessed = :isProcessed', { isProcessed: 0 })
        .andWhere('cart.isDirectPurchase = :isDirectPurchase', { isDirectPurchase: 0 })
        .andWhere(':today < cart.expiresOn', { today: new Date() })
        .getOne();
    }

    if (!cart) {
      cart = Cart.create({
        userId,
        storeId,
        isProcessed: false,
        isDirectPurchase,
        cartItems: [],
        expiresOn: add(new Date(), isDirectPurchase ? { hours: 1 } : { days: 2 }),
      });
    }

    const cartItem = cart.cartItems.find(cartItem => cartItem.productId === Number(productId));

    let itemQuantity = 0;

    if (cartItem) {
      // @TODO: Problema con las características cuando se actualiza con un producto cuyas características seleccionadas son las mismas
      cartItem.quantity += quantity;
      itemQuantity = cartItem.quantity;
    } else {
      cart.cartItems.push(CartItem.create({
        productId,
        productName: product.name,
        productImage: product.productImages[0].path,
        productPrice: product.finalPrice,
        quantity,
        cartItemFeatures: [
          ...(await this.productFeaturesRepository.find({ id: In(featureIds) }))
            .map(({name, value, price}) => CartItemFeature.create({name, value, price})),

          ...(await this.productFeatureForGroupsRepository.find({ id: In(featureForGroupIds) }))
            .map(({name, value, price}) => CartItemFeature.create({name, value, price})),
        ]
      }));
      itemQuantity = quantity;
    }

    if (itemQuantity > product.quantity) {
      throw new ProductQuantityIsLessThanRequiredQuantityException();
    }

    return await this.cartsRepository.save(cart);
  }

  async findOneStoreId(userId: number, storeId: number): Promise<Cart> {
    const cart = await this.cartsRepository.createQueryBuilder('cart')
      .leftJoinAndSelect('cart.cartItems', 'cartItem')
      .leftJoinAndSelect('cartItem.cartItemFeatures', 'cartItemFeature')
      .where('cart.userId = :userId', { userId })
      .where('cart.storeId = :storeId', { storeId })
      .andWhere(':today < cart.expiresOn', { today: new Date() })
      .getOne();

    if (!cart) {
      throw new CartNotFoundException();
    }

    return cart;
  }

  async findOneById(id: number): Promise<Cart> {
    const cart = await this.cartsRepository.createQueryBuilder('cart')
      .leftJoinAndSelect('cart.cartItems', 'cartItem')
      .leftJoinAndSelect('cartItem.cartItemFeatures', 'cartItemFeature')
      .where('cart.id = :cartId', { cartId: id })
      .andWhere(':today < cart.expiresOn', { today: new Date() })
      .getOne();

    if (!cart) {
      throw new CartNotFoundException();
    }

    return cart;
  }

  async deleteCartItem({userId, cartId, cartItemId}: DeleteCartitemDto): Promise<Cart> {
    const cartItem = await this.cartItemsRepository.createQueryBuilder('cartItem')
      .innerJoin('cartItem.cart', 'cart')
      .where('cartItem.id = :cartItemId', { cartItemId })
      .andWhere('cart.userId = :userId', { userId })
      .andWhere('cart.id = :cartId', { cartId })
      .andWhere('cart.isProcessed = :isProcessed', { isProcessed: 0 })
      .getOne();

    if (!cartItem) {
      throw new CartItemNotFoundException();
    }

    await this.cartItemsRepository.remove(cartItem);

    const cart = await this.cartsRepository.createQueryBuilder('cart')
      .leftJoinAndSelect('cart.cartItems', 'cartItem')
      .leftJoinAndSelect('cartItem.cartItemFeatures', 'cartItemFeature')
      .where('cart.userId = :userId', { userId })
      .andWhere('cart.id = :cartId', { cartId })
      .andWhere('cart.isProcessed = :isProcessed', { isProcessed: 0 })
      .getOne();

    if (!cart) {
      throw new CartNotFoundException();
    }

    return cart;
  }

  async updateCartItemQuantity({userId, cartId, cartItemId, quantity}: UpdateCartItemQuantityDto): Promise<CartItem> {
    const cartItem = await this.cartItemsRepository.createQueryBuilder('cartItem')
      .innerJoin('cartItem.cart', 'cart')
      .where('cartItem.id = :cartItemId', { cartItemId })
      .andWhere('cart.userId = :userId', { userId })
      .andWhere('cart.id = :cartId', { cartId })
      .andWhere('cart.isProcessed = :isProcessed', { isProcessed: 0 })
      .getOne();

    if (!cartItem) {
      throw new CartItemNotFoundException();
    }

    const product = await this.productsRepository.findOne(cartItem.productId);

    if (!product) {
      throw new ProductNotFoundException();
    }

    cartItem.quantity = quantity;

    if (cartItem.quantity > product.quantity) {
      throw new ProductQuantityIsLessThanRequiredQuantityException();
    }

    return await this.cartItemsRepository.save(cartItem);
  }

  async delete({cartId, userId}: {cartId: number, userId: number}): Promise<void> {
    const cart = await this.cartsRepository.createQueryBuilder('cart')
      .where('cart.id = :cartId', { cartId })
      .andWhere('cart.userId = :userId', { userId })
      .andWhere('cart.isProcessed = :isProcessed', { isProcessed: 0 })
      .getOne();

    if (!cart) {
      throw new CartNotFoundException();
    }

    await this.cartsRepository.remove(cart);
  }
}

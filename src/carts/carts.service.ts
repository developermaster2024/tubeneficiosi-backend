import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { add } from 'date-fns';
import { ProductFeature } from 'src/product-features/entities/product-feature.entity';
import { ProductFeatureForGroup } from 'src/products/entities/product-feature-for-group.entity';
import { Product } from 'src/products/entities/product.entity';
import { ProductNotFoundException } from 'src/products/errors/product-not-found.exception';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/roles.enum';
import { UserNotFoundException } from 'src/users/errors/user-not-found.exception';
import { In, Repository } from 'typeorm';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CartPaginationOptionsDto } from './dto/cart-pagination-options.dto';
import { DeleteCartitemDto } from './dto/delete-cart-item.dto';
import { UpdateCartItemQuantityDto } from './dto/update-cart-item-quantity.dto';
import { CartItemFeature } from './entities/cart-item-feature.entity';
import { CartItem } from './entities/cart-item.entity';
import { Cart } from './entities/cart.entity';
import { CartItemNotFoundException } from './errors/cart-item-not-found.exception';
import { CartNotFoundException } from './errors/cart-not-found.exception';
import { ProductQuantityIsLessThanRequiredQuantityException } from './errors/product-quantity-is-less-than-required-quantity.exception';

type FindOneQueryParams = {
  isExpired: boolean|null,
  isProcessed: boolean|null,
}

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart) private readonly cartsRepository: Repository<Cart>,
    @InjectRepository(CartItem) private readonly cartItemsRepository: Repository<CartItem>,
    @InjectRepository(Product) private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductFeature) private readonly productFeaturesRepository: Repository<ProductFeature>,
    @InjectRepository(ProductFeatureForGroup) private readonly productFeatureForGroupsRepository: Repository<ProductFeatureForGroup>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>
  ) {}

  async paginate({offset, perPage, filters: {
    id,
    storeName,
    clientName,
    minTotal,
    maxTotal,
    minDate,
    maxDate,
    isProcessed,
    isExpired,
    isDirectPurchase,
  }}: CartPaginationOptionsDto, userId: number): Promise<PaginationResult<Cart>> {
    const user = await this.usersRepository.findOne(userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    const queryBuilder = this.cartsRepository.createQueryBuilder('cart')
      .take(perPage)
      .skip(offset)
      .leftJoinAndSelect('cart.cartItems', 'cartItem')
      .leftJoinAndSelect('cartItem.cartItemFeatures', 'cartItemFeature')
      .leftJoinAndSelect('cart.store', 'store')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile')
      .leftJoinAndSelect('store.storeHours', 'storeHour')
      .innerJoinAndSelect('cart.user', 'user')
      .leftJoinAndSelect('user.client', 'client')
      .leftJoinAndSelect('cart.order', 'order')
      .leftJoinAndSelect('order.orderStatus', 'orderStatus')
      .leftJoinAndSelect('order.paymentMethod', 'paymentMethod')
      .leftJoinAndSelect('order.deliveryMethod', 'deliveryMethod')
      .leftJoinAndSelect('order.delivery', 'delivery')
      .leftJoinAndSelect('delivery.profileAddress', 'profileAddress')
      .leftJoinAndSelect('order.bankTransfers', 'bankTransfer')
      .leftJoinAndSelect('bankTransfer.bankAccount', 'bankAccount')
      .leftJoinAndSelect('bankAccount.cardIssuer', 'cardIssuer')
      .leftJoinAndSelect('order.orderStatusHistory', 'orderStatusHistory')
      .leftJoinAndSelect('orderStatusHistory.prevOrderStatus', 'prevOrderStatus')
      .leftJoinAndSelect('orderStatusHistory.newOrderStatus', 'newOrderStatus')
      .leftJoinAndSelect('order.orderRejectionReason', 'orderRejectionReason');

    if (user.role === Role.CLIENT) {
      queryBuilder.andWhere('cart.userId = :userId', { userId });
    } else if (user.role === Role.STORE) {
      queryBuilder.andWhere('store.userId = :userId', { userId });
    }

    if (id) queryBuilder.andWhere('cart.id = :id', { id });

    if (storeName) queryBuilder.andWhere('store.name LIKE :storeName', { storeName: `%${storeName}%` });

    if (clientName) queryBuilder.andWhere('client.name LIKE :clientName', { clientName: `%${clientName}%` });

    if (minDate) queryBuilder.andWhere('cart.createdAt >= :minDate', { minDate });

    if (maxDate) queryBuilder.andWhere('cart.createdAt <= :maxDate', { maxDate });

    if (isProcessed !== null) queryBuilder.andWhere('cart.isProcessed = :isProcessed', { isProcessed: +isProcessed });

    if (isExpired !== null) {
      const comparator = isExpired ? '<' : '>';

      queryBuilder.andWhere(`cart.expiresOn ${comparator} :today`, { today: new Date() });
    }

    if (isDirectPurchase !== null) queryBuilder.andWhere('cart.isDirectPurchase = :isDirectPurchase', { isDirectPurchase: +isDirectPurchase});

    const [carts, total] = await queryBuilder.getManyAndCount();

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
        productSlug: product.slug,
        quantity,
        cartItemFeatures: [
          ...(await this.productFeaturesRepository.find({ id: In(featureIds), productId }))
            .map(({name, value, price}) => CartItemFeature.create({name, value, price})),

          ...(await this.productFeatureForGroupsRepository.find({ id: In(featureForGroupIds), productFeatureGroup: { productId } }))
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

  async findOneStoreId(userId: number, storeId: number, { isExpired, isProcessed }: FindOneQueryParams ): Promise<Cart> {
    const user = await this.usersRepository.findOne(userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    const queryBuilder = this.cartsRepository.createQueryBuilder('cart')
      .leftJoinAndSelect('cart.cartItems', 'cartItem')
      .leftJoinAndSelect('cartItem.cartItemFeatures', 'cartItemFeature')
      .innerJoinAndSelect('cart.user', 'user')
      .leftJoinAndSelect('user.client', 'client')
      .leftJoinAndSelect('cart.store', 'store')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile')
      .leftJoinAndSelect('store.storeHours', 'storeHour')
      .leftJoinAndSelect('cart.order', 'order')
      .leftJoinAndSelect('order.orderStatus', 'orderStatus')
      .leftJoinAndSelect('order.paymentMethod', 'paymentMethod')
      .leftJoinAndSelect('order.deliveryMethod', 'deliveryMethod')
      .leftJoinAndSelect('order.delivery', 'delivery')
      .leftJoinAndSelect('delivery.profileAddress', 'profileAddress')
      .leftJoinAndSelect('order.bankTransfers', 'bankTransfer')
      .leftJoinAndSelect('bankTransfer.bankAccount', 'bankAccount')
      .leftJoinAndSelect('bankAccount.cardIssuer', 'cardIssuer')
      .leftJoinAndSelect('order.orderStatusHistory', 'orderStatusHistory')
      .leftJoinAndSelect('orderStatusHistory.prevOrderStatus', 'prevOrderStatus')
      .leftJoinAndSelect('orderStatusHistory.newOrderStatus', 'newOrderStatus')
      .leftJoinAndSelect('order.orderRejectionReason', 'orderRejectionReason')
      .where('cart.userId = :userId', { userId })
      .andWhere('cart.storeId = :storeId', { storeId });

    if (user.role === Role.CLIENT) {
      queryBuilder.andWhere('cart.userId = :userId', { userId });
    } else if (user.role === Role.STORE) {
      queryBuilder.andWhere('store.userId = :userId', { userId });
    }

    if (isExpired !== null) {
      const comparator = isExpired ? '<' : '>';

      queryBuilder.andWhere(`cart.expiresOn ${comparator} :today`, { today: new Date() });
    }

    if (isProcessed !== null) queryBuilder.andWhere('cart.isProcessed = :isProcessed', { isProcessed: +isProcessed });

    const cart = await queryBuilder.getOne();

    if (!cart) {
      throw new CartNotFoundException();
    }

    return cart;
  }

  async findOneById(id: number, { isExpired, isProcessed }: FindOneQueryParams): Promise<Cart> {
    const queryBuilder = this.cartsRepository.createQueryBuilder('cart')
      .leftJoinAndSelect('cart.cartItems', 'cartItem')
      .leftJoinAndSelect('cartItem.cartItemFeatures', 'cartItemFeature')
      .innerJoinAndSelect('cart.user', 'user')
      .leftJoinAndSelect('user.client', 'client')
      .leftJoinAndSelect('cart.store', 'store')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile')
      .leftJoinAndSelect('store.storeHours', 'storeHour')
      .leftJoinAndSelect('cart.order', 'order')
      .leftJoinAndSelect('order.orderStatus', 'orderStatus')
      .leftJoinAndSelect('order.paymentMethod', 'paymentMethod')
      .leftJoinAndSelect('order.deliveryMethod', 'deliveryMethod')
      .leftJoinAndSelect('order.delivery', 'delivery')
      .leftJoinAndSelect('delivery.profileAddress', 'profileAddress')
      .leftJoinAndSelect('order.bankTransfers', 'bankTransfer')
      .leftJoinAndSelect('bankTransfer.bankAccount', 'bankAccount')
      .leftJoinAndSelect('bankAccount.cardIssuer', 'cardIssuer')
      .leftJoinAndSelect('order.orderStatusHistory', 'orderStatusHistory')
      .leftJoinAndSelect('orderStatusHistory.prevOrderStatus', 'prevOrderStatus')
      .leftJoinAndSelect('orderStatusHistory.newOrderStatus', 'newOrderStatus')
      .leftJoinAndSelect('order.orderRejectionReason', 'orderRejectionReason')
      .where('cart.id = :cartId', { cartId: id });

    if (isExpired !== null) {
      const comparator = isExpired ? '<' : '>';

      queryBuilder.andWhere(`cart.expiresOn ${comparator} :today`, { today: new Date() });
    }

    if (isProcessed !== null) queryBuilder.andWhere('cart.isProcessed = :isProcessed', { isProcessed: +isProcessed });

    const cart = await queryBuilder.getOne();

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
      .innerJoinAndSelect('cart.user', 'user')
      .leftJoinAndSelect('user.client', 'client')
      .leftJoinAndSelect('cart.store', 'store')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile')
      .leftJoinAndSelect('store.storeHours', 'storeHour')
      .leftJoinAndSelect('cart.order', 'order')
      .leftJoinAndSelect('order.orderStatus', 'orderStatus')
      .leftJoinAndSelect('order.paymentMethod', 'paymentMethod')
      .leftJoinAndSelect('order.deliveryMethod', 'deliveryMethod')
      .leftJoinAndSelect('order.delivery', 'delivery')
      .leftJoinAndSelect('delivery.profileAddress', 'profileAddress')
      .leftJoinAndSelect('order.bankTransfers', 'bankTransfer')
      .leftJoinAndSelect('bankTransfer.bankAccount', 'bankAccount')
      .leftJoinAndSelect('bankAccount.cardIssuer', 'cardIssuer')
      .leftJoinAndSelect('order.orderStatusHistory', 'orderStatusHistory')
      .leftJoinAndSelect('orderStatusHistory.prevOrderStatus', 'prevOrderStatus')
      .leftJoinAndSelect('orderStatusHistory.newOrderStatus', 'newOrderStatus')
      .leftJoinAndSelect('order.orderRejectionReason', 'orderRejectionReason')
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

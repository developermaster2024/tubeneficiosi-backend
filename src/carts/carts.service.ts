import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { add, startOfWeek } from 'date-fns';
import { Discount } from 'src/discounts/entities/discount.entity';
import { ProductFeature } from 'src/product-features/entities/product-feature.entity';
import { ProductFeatureForGroup } from 'src/products/entities/product-feature-for-group.entity';
import { Product } from 'src/products/entities/product.entity';
import { ProductNotFoundException } from 'src/products/errors/product-not-found.exception';
import { ShowNotFoundException } from 'src/shows/errors/show-not-found.exception';
import { ShowToZoneNotFoundException } from 'src/shows/errors/show-to-zone-not-found.exception';
import { Store } from 'src/stores/entities/store.entity';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/roles.enum';
import { UserNotFoundException } from 'src/users/errors/user-not-found.exception';
import { Connection, In, Repository } from 'typeorm';
import { AddShowToCartDto } from './dto/add-show-to-cart.dto';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CartPaginationOptionsDto } from './dto/cart-pagination-options.dto';
import { CartsSummaryDto } from './dto/carts-summary.dto';
import { DeleteCartitemDto } from './dto/delete-cart-item.dto';
import { UpdateCartDiscountDto } from './dto/update-cart-discount.dto';
import { UpdateCartItemQuantityDto } from './dto/update-cart-item-quantity.dto';
import { CartItemFeature } from './entities/cart-item-feature.entity';
import { CartItemShowDetails } from './entities/cart-item-show-details.entity';
import { CartItem } from './entities/cart-item.entity';
import { Cart } from './entities/cart.entity';
import { CartItemNotFoundException } from './errors/cart-item-not-found.exception';
import { CartNotFoundException } from './errors/cart-not-found.exception';
import { ProductQuantityIsLessThanRequiredQuantityException } from './errors/product-quantity-is-less-than-required-quantity.exception';
import { QuantityIsGreaterThanAvailableSeatsException } from './errors/quantity-is-greater-than-available-seats.exception';

type FindOneQueryParams = {
  isExpired: boolean|null,
  isProcessed: boolean|null,
  isDirectPurchase: boolean|null,
}

@Injectable()
export class CartsService {
  constructor(
    private readonly connection: Connection,
    @InjectRepository(Cart) private readonly cartsRepository: Repository<Cart>,
    @InjectRepository(CartItem) private readonly cartItemsRepository: Repository<CartItem>,
    @InjectRepository(Product) private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductFeature) private readonly productFeaturesRepository: Repository<ProductFeature>,
    @InjectRepository(ProductFeatureForGroup) private readonly productFeatureForGroupsRepository: Repository<ProductFeatureForGroup>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Discount) private readonly discountsRepository: Repository<Discount>,
    @InjectRepository(Store) private readonly storesRepository: Repository<Store>
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
      .leftJoinAndSelect('cartItem.cartItemShowDetails', 'cartItemShowDetails')
      .leftJoinAndSelect('cartItemShowDetails.show', 'show')
      .leftJoinAndSelect('cartItemShowDetails.zone', 'zone')
      .leftJoinAndSelect('cart.discount', 'discount')
      .leftJoinAndSelect('discount.discountType', 'discountType')
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

    if (minTotal) queryBuilder.andWhere('cart.sub_total_with_discount >= :minTotal', { minTotal });

    if (maxTotal) queryBuilder.andWhere('cart.sub_total_with_discount <= :maxTotal', { maxTotal });

    if (minDate) queryBuilder.andWhere('cart.createdAt >= :minDate', { minDate });

    if (maxDate) queryBuilder.andWhere('cart.createdAt <= :maxDate', { maxDate });

    if (isProcessed !== null) queryBuilder.andWhere('cart.isProcessed = :isProcessed', { isProcessed: +isProcessed });

    if (isExpired !== null) {
      const comparator = isExpired ? '<' : '>';

      queryBuilder.andWhere(`cart.expiresOn ${comparator} :today`, { today: new Date() });
    }

    if (isDirectPurchase !== null) queryBuilder.andWhere('cart.isDirectPurchase = :isDirectPurchase', { isDirectPurchase: +isDirectPurchase });

    const [carts, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(carts, total, perPage);
  }

  async addToCart({
    userId,
    storeId,
    productId,
    quantity,
    productFeaturesData,
    isDirectPurchase,
    discountId,
  }: AddToCartDto): Promise<Cart> {
    const featureIds = productFeaturesData?.featureIds ?? [];
    const featureForGroupIds = productFeaturesData?.featureForGroupIds ?? [];

    const product = await this.productsRepository.findOne({
      where: { id: productId, storeId },
      relations: ['productImages', 'productDetails'],
    });

    if (!product) {
      throw new ProductNotFoundException();
    }

    let cart: Cart;

    if (!isDirectPurchase) {
      cart = await this.cartsRepository.createQueryBuilder('cart')
        .leftJoinAndSelect('cart.cartItems', 'cartItem')
        .leftJoinAndSelect('cartItem.cartItemFeatures', 'cartItemFeature')
        .leftJoinAndSelect('cart.discount', 'discount')
        .innerJoinAndSelect('cart.store', 'store')
        .leftJoinAndSelect('store.storeProfile', 'storstoreProfile')
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
        store: await this.storesRepository.findOne(storeId),
        isProcessed: false,
        isDirectPurchase,
        cartItems: [],
        expiresOn: add(new Date(), isDirectPurchase ? { hours: 1 } : { days: 2 }),
      });
    }

    const discount = await this.discountsRepository.createQueryBuilder('discount')
      .leftJoin('discount.store', 'store')
      .where('discount.id = :discountId', { discountId })
      .andWhere('discount.from <= :today AND discount.until >= :today', { today: new Date() })
      .andWhere('store.id = :storeId', { storeId })
      .getOne();

    cart.discount = discount ?? null;

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
        productPrice: product.productDetails.finalPrice,
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

    if (itemQuantity > product.productDetails.quantity) {
      throw new ProductQuantityIsLessThanRequiredQuantityException();
    }

    cart.subTotal = cart.computedSubTotal;
    cart.subTotalWithDiscount = cart.computedSubTotalWithDiscount;

    return await this.cartsRepository.save(cart);
  }

  async addShowToCart({
    productId,
    userId,
    showId,
    zoneId,
    quantity,
  }: AddShowToCartDto): Promise<Cart> {
    const product = await this.productsRepository.createQueryBuilder('product')
      .innerJoinAndSelect('product.productImages', 'productImage')
      .innerJoinAndSelect('product.store', 'store')
      .innerJoinAndSelect('product.shows', 'show', 'show.id = :showId', { showId })
      .innerJoinAndSelect('show.showToZones', 'showToZone', 'showToZone.zoneId = :zoneId', { zoneId })
      .where('product.id = :productId', { productId })
      .getOne();

    if (!product) throw new ProductNotFoundException();

    const show = product.shows.find(show => show.id === Number(showId));

    if (!show) throw new ShowNotFoundException();

    const showToZone = show.showToZones.find(stz => stz.zoneId === Number(zoneId));

    if (!showToZone) throw new ShowToZoneNotFoundException();

    if (quantity > showToZone.availableSeats) {
      throw new QuantityIsGreaterThanAvailableSeatsException();
    }

    let cart = Cart.create({
      userId,
      store: product.store,
      isProcessed: false,
      isDirectPurchase: true,
      cartItems: [CartItem.create({
        product,
        productName: product.name,
        productImage: product.productImages[0].path,
        productPrice: showToZone.price,
        productSlug: product.slug,
        quantity,
        cartItemShowDetails: CartItemShowDetails.create({ showId, zoneId, showToZone }),
      })],
      expiresOn: add(new Date(), { hours: 1 }),
    });

    cart.subTotal = cart.computedSubTotal;
    cart.subTotalWithDiscount = cart.computedSubTotalWithDiscount;

    await this.connection.transaction(async () => {
      cart = await this.cartsRepository.save(cart);
    });

    return cart;
  }

  async updateCartDiscount({id, userId, storeId, discountId}: UpdateCartDiscountDto): Promise<Cart> {
    const cart = await this.cartsRepository.createQueryBuilder('cart')
      .leftJoinAndSelect('cart.cartItems', 'cartItem')
      .leftJoinAndSelect('cartItem.cartItemFeatures', 'cartItemFeature')
      .leftJoinAndSelect('cart.discount', 'discount')
      .innerJoinAndSelect('cart.store', 'store')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile')
      .where('cart.userId = :userId', { userId })
      .andWhere('cart.id = :id', { id })
      .andWhere('cart.storeId = :storeId', { storeId })
      .andWhere('cart.isProcessed = :isProcessed', { isProcessed: 0 })
      .andWhere(':today < cart.expiresOn', { today: new Date() })
      .getOne();

    if (!cart) throw new CartNotFoundException();

    const discount = await this.discountsRepository.createQueryBuilder('discount')
      .leftJoin('discount.store', 'store')
      .where('discount.id = :discountId', { discountId })
      .andWhere('discount.from <= :today AND discount.until >= :today', { today: new Date() })
      .andWhere('store.id = :storeId', { storeId })
      .getOne();

    cart.discount = discount ?? null;

    cart.subTotal = cart.computedSubTotal;
    cart.subTotalWithDiscount = cart.computedSubTotalWithDiscount;

    return await this.cartsRepository.save(cart);
  }

  async findOneStoreId(userId: number, storeId: number, { isExpired, isProcessed, isDirectPurchase }: FindOneQueryParams ): Promise<Cart> {
    const user = await this.usersRepository.findOne(userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    const queryBuilder = this.cartsRepository.createQueryBuilder('cart')
      .leftJoinAndSelect('cart.cartItems', 'cartItem')
      .leftJoinAndSelect('cartItem.cartItemFeatures', 'cartItemFeature')
      .leftJoinAndSelect('cartItem.cartItemShowDetails', 'cartItemShowDetails')
      .leftJoinAndSelect('cartItemShowDetails.show', 'show')
      .leftJoinAndSelect('cartItemShowDetails.zone', 'zone')
      .leftJoinAndSelect('cart.discount', 'discount')
      .leftJoinAndSelect('discount.discountType', 'discountType')
      .leftJoinAndSelect('discount.cardIssuers', 'cardIssuerFromDiscount')
      .leftJoinAndSelect('discount.cards', 'card')
      .leftJoinAndSelect('card.cardIssuer', 'cardIssuerFromCard')
      .leftJoinAndSelect('card.cardType', 'cardType')
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

    if (isDirectPurchase !== null) queryBuilder.andWhere('cart.isDirectPurchase = :isDirectPurchase', { isDirectPurchase: +isDirectPurchase });

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
      .leftJoinAndSelect('cartItem.cartItemShowDetails', 'cartItemShowDetails')
      .leftJoinAndSelect('cartItemShowDetails.show', 'show')
      .leftJoinAndSelect('cartItemShowDetails.zone', 'zone')
      .leftJoinAndSelect('cart.discount', 'discount')
      .leftJoinAndSelect('discount.discountType', 'discountType')
      .leftJoinAndSelect('discount.cardIssuers', 'cardIssuerFromDiscount')
      .leftJoinAndSelect('discount.cards', 'card')
      .leftJoinAndSelect('card.cardIssuer', 'cardIssuerFromCard')
      .leftJoinAndSelect('card.cardType', 'cardType')
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
      .leftJoinAndSelect('cart.discount', 'discount')
      .leftJoinAndSelect('discount.discountType', 'discountType')
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

    cart.subTotal = cart.computedSubTotal;
    cart.subTotalWithDiscount = cart.computedSubTotalWithDiscount;

    return await this.cartsRepository.save(cart);
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

    if (cartItem.quantity > product.productDetails.quantity) {
      throw new ProductQuantityIsLessThanRequiredQuantityException();
    }

    const cart = await this.cartsRepository.createQueryBuilder('cart')
      .leftJoinAndSelect('cart.cartItems', 'cartItem')
      .leftJoinAndSelect('cartItem.cartItemFeatures', 'cartItemFeature')
      .leftJoinAndSelect('cart.discount', 'discount')
      .leftJoinAndSelect('discount.discountType', 'discountType')
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

    const savedCartItem = await this.cartItemsRepository.save(cartItem);

    cart.subTotal = cart.computedSubTotal;
    cart.subTotalWithDiscount = cart.computedSubTotalWithDiscount;

    await this.cartsRepository.save(cart);

    return savedCartItem;
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

  async cartsSummary(userId: number): Promise<CartsSummaryDto> {
    const user = await this.usersRepository.findOne(userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    const cartsSummaryQueryBuilder = this.cartsRepository.createQueryBuilder('cart')
      .innerJoin('cart.store', 'store')
      .select('AVG(cart.subTotal)', 'totalAverage')
      .addSelect('AVG(cart.subTotalWithDiscount)', 'totalAverageWithDiscount');

    const cartsCountThisWeekQueryBuilder = this.cartsRepository.createQueryBuilder('cart')
      .innerJoin('cart.store', 'store')
      .select('COUNT(cart.id)', 'numberOfCartsThisWeek')
      .where('cart.createdAt >= :startOfWeek AND cart.createdAt <= :now', {
        startOfWeek: startOfWeek(new Date(), { weekStartsOn: 1 }),
        now: new Date(),
      });

    if (user.role === Role.CLIENT) {
      cartsSummaryQueryBuilder.andWhere('cart.userId = :userId', { userId });
      cartsCountThisWeekQueryBuilder.andWhere('cart.userId = :userId', { userId });
    } else if (user.role === Role.STORE) {
      cartsSummaryQueryBuilder.andWhere('store.userId = :userId', { userId });
      cartsCountThisWeekQueryBuilder.andWhere('store.userId = :userId', { userId });
    }

    const cartsSummary = await cartsSummaryQueryBuilder.getRawOne<{totalAverage: number, totalAverageWithDiscount: number}>();
    const cartsCountThisWeek = await cartsCountThisWeekQueryBuilder.getRawOne<{numberOfCartsThisWeek: number}>();

    return {...cartsSummary, ...cartsCountThisWeek};
  }

  async cartsCount(userId: number, { isExpired, isProcessed, isDirectPurchase }: FindOneQueryParams): Promise<{count: number}> {
    const user = await this.usersRepository.findOne(userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    const queryBuilder = this.cartsRepository.createQueryBuilder('cart')
      .innerJoin('cart.store', 'store')
      .select('COUNT(cart.id)', 'count');

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

    if (isDirectPurchase !== null) queryBuilder.andWhere('cart.isDirectPurchase = :isDirectPurchase', { isDirectPurchase: +isDirectPurchase });

    return await queryBuilder.getRawOne<{count: number}>();
  }
}

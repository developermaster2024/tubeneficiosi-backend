import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankTransfer } from 'src/bank-transfers/entities/bank-transfer.entity';
import { Cart } from 'src/carts/entities/cart.entity';
import { CartNotFoundException } from 'src/carts/errors/cart-not-found.exception';
import { DeliveryZoneNotFoundException } from 'src/delivery-methods/errors/delivery-zone-not-found.exception';
import { PaymentBelowTotalException } from 'src/carts/errors/payment-bellow-total.exception';
import { PaymentExceedsTotalException } from 'src/carts/errors/payment-exceeds-total.exception';
import { Delivery } from 'src/deliveries/entities/delivery.entity';
import { DeliveryZone } from 'src/delivery-methods/entities/delivery-zone.entity';
import { OrderStatuses } from 'src/order-statuses/enums/order-statuses.enum';
import { PaymentMethods } from 'src/payment-methods/enum/payment-methods.enum';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { OrderNotFoundException } from './errors/order-not-found.exception';
import { OrderPaginationOptionsDto } from './dto/order-pagination-options.dto';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { User } from 'src/users/entities/user.entity';
import { UserNotFoundException } from 'src/users/errors/user-not-found.exception';
import { Role } from 'src/users/enums/roles.enum';
import { Product } from 'src/products/entities/product.entity';
import { ProductQuantityIsLessThanRequiredQuantityException } from 'src/carts/errors/product-quantity-is-less-than-required-quantity.exception';
import { DeliveryMethod } from 'src/delivery-methods/entities/delivery-method.entity';
import { DeliveryMethodNotFoundException } from 'src/delivery-methods/errors/delivery-method-not-found.exception';
import { DeliveryCostCalculatorResolver } from 'src/delivery-methods/support/delivery-cost-calculator-resolver';
import { OrderStatusHistory } from './entities/order-status-history.entity';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { IncorrectOrderStatusException } from './errors/incorrect-order-status.exception';
import { OrderStatus } from 'src/order-statuses/entities/order-status.entity';
import { OrderStatusNotFoundException } from './errors/order-status-not-found.exception';
import { OrderStatusIsAlreadyInHistoryException } from './errors/order-status-is-already-in-history.exception';
import { UserMustBeAdminException } from './errors/user-must-be-admin.exception';
import { UserMustBeTheStoreThatOwnsTheProduct } from './errors/user-must-be-the-store-that-owns-the-product.exception';
import { UserMustBeTheBuyer } from './errors/user-must-be-the-buyer.exception';
import { OrderRejectionReason } from 'src/order-statuses/entities/order-rejection-reason.entity';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { Notification } from 'src/notifications/entities/notification.entity';
import { NotificationTypes } from 'src/notifications/enums/notification-types.enum';
import { UserToNotification } from 'src/notifications/entities/user-to-notification.entity';
import { StoreIsClosedException } from './errors/store-is-closed.exception';
import { OrdersCountDto } from './dto/orders-count.dto';
import { DeliveryMethodNotAllowedByProductException } from './errors/delivery-method-not-allowed-by-product.exception';
import { MercadoPagoPaymentGateway } from 'src/payment-gateways/mercado-pago-payment-gateway';
import { ProductDetails } from 'src/products/entities/product-details.entity';
import { QuantityIsGreaterThanAvailableSeatsException } from 'src/carts/errors/quantity-is-greater-than-available-seats.exception';
import { ShowToZone } from 'src/shows/entities/show-to-zone.entity';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Cart) private readonly cartsRepository: Repository<Cart>,
    @InjectRepository(DeliveryZone) private readonly deliveryZoneRepository: Repository<DeliveryZone>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Product) private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductDetails) private readonly productDetailsRepository: Repository<ProductDetails>,
    @InjectRepository(DeliveryMethod) private readonly deliveryMethodsRepository: Repository<DeliveryMethod>,
    @InjectRepository(OrderStatus) private readonly orderStatusesRepository: Repository<OrderStatus>,
    @InjectRepository(Notification) private readonly notificationsRepository: Repository<Notification>,
    @InjectRepository(ShowToZone) private readonly showToZonesRepository: Repository<ShowToZone>,
    private readonly deliveryCostCalculatorResolver: DeliveryCostCalculatorResolver,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly notificationsService: NotificationsService,
    private readonly mercadoPagoPaymentGateway: MercadoPagoPaymentGateway
  ) {}

  async paginate({perPage, offset, filters: {
    id,
    orderNumber,
    address,
    storeName,
    minTotal,
    maxTotal,
    minDate,
    maxDate,
    orderStatusCode,
    paymentMethodCode,
    clientId,
    storeId,
  }, order}: OrderPaginationOptionsDto, userId: number): Promise<PaginationResult<Order>> {
    const user = await this.usersRepository.findOne(userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    const queryBuilder = this.ordersRepository.createQueryBuilder('order')
      .take(perPage)
      .skip(offset)
      .innerJoinAndSelect('order.orderStatus', 'orderStatus')
      .innerJoinAndSelect('order.paymentMethod', 'paymentMethod')
      .innerJoinAndSelect('order.store', 'store')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile')
      .leftJoinAndSelect('store.storeHours', 'storeHour')
      .leftJoinAndSelect('order.deliveryMethod', 'deliveryMethod')
      .leftJoinAndSelect('order.delivery', 'delivery')
      .leftJoinAndSelect('delivery.profileAddress', 'profileAddress')
      .innerJoinAndSelect('order.cart', 'cart')
      .leftJoinAndSelect('cart.cartItems', 'cartItem')
      .leftJoinAndSelect('cartItem.cartItemFeatures', 'cartItemFeature')
      .leftJoinAndSelect('cart.discount', 'discount')
      .leftJoinAndSelect('order.bankTransfers', 'bankTransfer')
      .leftJoinAndSelect('bankTransfer.bankAccount', 'bankAccount')
      .leftJoinAndSelect('bankAccount.cardIssuer', 'cardIssuer')
      .innerJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('user.client', 'client')
      .innerJoinAndSelect('order.orderStatusHistory', 'orderStatusHistory')
      .leftJoinAndSelect('orderStatusHistory.prevOrderStatus', 'prevOrderStatus')
      .innerJoinAndSelect('orderStatusHistory.newOrderStatus', 'newOrderStatus')
      .leftJoinAndSelect('order.orderRejectionReason', 'orderRejectionReason')
      .leftJoinAndSelect('order.productRatings', 'productRating')
      .leftJoinAndSelect('order.storeRating', 'storeRating');

    if (user.role === Role.CLIENT) {
      queryBuilder.andWhere('order.userId = :userId', { userId });
    } else if (user.role === Role.STORE) {
      queryBuilder.andWhere('store.userId = :userId', { userId });
    }

    Object.keys(order).forEach(key => queryBuilder.addOrderBy(`order.${key}`, order[key]));

    if (id) queryBuilder.andWhere('order.id = :id', { id });

    if (orderNumber) queryBuilder.andWhere('order.orderNumber = :orderNumber', { orderNumber });

    if (address) queryBuilder.andWhere('profileAddress.address LIKE :address', { address: `%${address}%` });

    if (storeName) queryBuilder.andWhere('store.name LIKE :storeName', { storeName: `%${storeName}%` });

    if (minTotal) queryBuilder.andWhere('order.total >= :minTotal', { minTotal });

    if (maxTotal) queryBuilder.andWhere('order.total <= :maxTotal', { maxTotal });

    if (minDate) queryBuilder.andWhere('order.createdAt >= :minDate', { minDate });

    if (maxDate) queryBuilder.andWhere('order.createdAt <= :maxDate', { maxDate });

    if (orderStatusCode) queryBuilder.andWhere('order.orderStatusCode = :orderStatusCode', { orderStatusCode });

    if (paymentMethodCode) queryBuilder.andWhere('order.paymentMethodCode = :paymentMethodCode', { paymentMethodCode });

    if (clientId) queryBuilder.andWhere('order.userId = :clientId', { clientId });

    if (storeId) queryBuilder.andWhere('order.storeId = :storeId', { storeId });

    const [orders, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(orders, total, perPage);
  }

  async create({
    userId,
    cartId,
    deliveryMethodId,
    profileAddressId,
    paymentMethodCode,
    bankTransfers = [],
  }: CreateOrderDto, images: Express.Multer.File[]): Promise<{order: Order, url: string}> {
    const order = Order.create({});

    const cart = await this.cartsRepository.createQueryBuilder('cart')
      .innerJoinAndSelect('cart.user', 'user')
      .leftJoinAndSelect('user.client', 'client')
      .innerJoinAndSelect('cart.store', 'store')
      .innerJoinAndSelect('store.user', 'storeUser')
      .leftJoinAndSelect('store.storeHours', 'storeHour')
      .leftJoinAndSelect('cart.cartItems', 'cartItem')
      .leftJoinAndSelect('cartItem.cartItemFeatures', 'cartItemFeature')
      .leftJoinAndSelect('cartItem.cartItemShowDetails', 'cartItemShowDetails')
      .leftJoinAndSelect('cartItemShowDetails.showToZone', 'showToZone')
      .leftJoinAndSelect('cart.discount', 'discount')
      .leftJoinAndSelect('cartItem.product', 'product')
      .leftJoinAndSelect('product.productDimensions', 'productDimensions')
      .leftJoinAndSelect('product.deliveryMethodTypes', 'deliveryMethodType')
      .where('cart.id = :cartId', { cartId })
      .andWhere('cart.userId = :userId', { userId })
      .andWhere('cart.isProcessed = :isProcessed', { isProcessed: 0 })
      .andWhere(':today < cart.expiresOn', { today: new Date() })
      .getOne();

    if (!cart) {
      throw new CartNotFoundException();
    }

    if (!cart.store.isOpen) {
      throw new StoreIsClosedException();
    }

    for (let cartItem of cart.cartItems) {
      const product = await this.productsRepository.createQueryBuilder('product')
        .innerJoin('product.productDetails', 'productDetails')
        .where('productDetails.quantity < :quantity', { quantity: cartItem.quantity })
        .getOne();

      if (product) {
        throw new ProductQuantityIsLessThanRequiredQuantityException(cartItem);
      }

      if (!cartItem.cartItemShowDetails) {
        continue;
      }

      const quantityIsGreaterThanAvailableSeats = cartItem.quantity > cartItem.cartItemShowDetails.showToZone.availableSeats;

      if (quantityIsGreaterThanAvailableSeats) throw new QuantityIsGreaterThanAvailableSeatsException();
    }

    const lastOrder = await this.ordersRepository.findOne({ order: { id: 'DESC' } });
    order.orderNumber = (lastOrder ? +lastOrder.orderNumber + 1 : 1).toString().padStart(6, '0');
    order.cart = cart;
    order.storeId = cart.store.id;
    order.user = cart.user;
    order.orderStatusCode = OrderStatuses.CONFIRMING_PAYMENT;
    order.paymentMethodCode = paymentMethodCode;
    const orderStatus = await this.orderStatusesRepository.findOne({ code: OrderStatuses.CONFIRMING_PAYMENT });
    if (!orderStatus) throw new OrderStatusNotFoundException();
    order.orderStatusHistory = [OrderStatusHistory.create({newOrderStatus: orderStatus})];

    if (deliveryMethodId) {
      order.deliveryMethodId = deliveryMethodId;

      const deliveryZone = await this.deliveryZoneRepository.createQueryBuilder('deliveryZone')
        .innerJoin('deliveryZone.deliveryMethod', 'deliveryMethod')
        .innerJoin('deliveryZone.locations', 'location', `ST_CONTAINS(location.area, (
          SELECT
            POINT(address.latitude, address.longitude)
          FROM
            client_addresses address
          WHERE
            address.id = :addressId AND address.deleted_at IS NULL
          LIMIT 1
        ))`, {  addressId: profileAddressId })
        .andWhere('deliveryMethod.id = :deliveryMethodId', { deliveryMethodId })
        .orderBy('location.createdAt', 'DESC')
        .getOne();

      if (!deliveryZone) {
        throw new DeliveryZoneNotFoundException();
      }

      const deliveryMethod = await this.deliveryMethodsRepository.findOne({
        select: ['id', 'deliveryMethodTypeCode', 'storeId'],
        where: { id: deliveryMethodId, storeId: cart.store.id },
      });

      if (!deliveryMethod) {
        throw new DeliveryMethodNotFoundException();
      }

      cart.cartItems.forEach(({product}) => {
        const productAllowsDeliveryMethodType = product.deliveryMethodTypes.map(dmt => dmt.code).includes(deliveryMethod.deliveryMethodTypeCode);

        if (!productAllowsDeliveryMethodType) {
          throw new DeliveryMethodNotAllowedByProductException(product);
        }
      });

      order.delivery = Delivery.create({
        profileAddressId,
        deliveryZone,
        total: await this.deliveryCostCalculatorResolver.calculateCost({
          addressId: profileAddressId,
          deliveryMethodId,
          products: cart.cartItems,
        }, deliveryMethod.deliveryMethodTypeCode),
      });
    }

    if (paymentMethodCode === PaymentMethods.BANK_TRANSFER) {
      order.bankTransfers = bankTransfers.map((bankTransfer, i) => BankTransfer.create({
        ...bankTransfer,
        imgPath: images[i].path,
      }));

      const bankTransfersTotal = order.bankTransfers.reduce((total, transfer) => Number(total) + Number(transfer.amount), 0);

      if (bankTransfersTotal > order.total) {
        throw new PaymentExceedsTotalException();
      } else if (bankTransfersTotal < order.total) {
        throw new PaymentBelowTotalException();
      }
    }

    cart.isProcessed = true;
    await this.cartsRepository.save(cart);

    await this.productDetailsRepository.createQueryBuilder('productDetails')
      .update(ProductDetails)
      .set({
        quantity: () => `
          product_details.quantity - (SELECT
            cart_items.quantity
          FROM
            cart_items
          WHERE
            cart_items.product_id = product_details.product_id AND
            cart_items.cart_id = ${cart.id}
          LIMIT
            1
          )
        `
      })
      .where('product_id IN (:...productIds)', { productIds: cart.cartItems.map(item => item.productId) })
      .execute();

    const showToZones = cart.cartItems.map(cartItem => cartItem.cartItemShowDetails ? Object.assign(cartItem.cartItemShowDetails.showToZone, {
      availableSeats: cartItem.cartItemShowDetails.showToZone.availableSeats - cartItem.quantity
    }) : null).filter(stz => stz);

    if (showToZones.length > 0) {
      this.showToZonesRepository.save(showToZones);
    }

    order.total = order.calculatedTotal;
    const savedOrder = await this.ordersRepository.save(order);

    let url: string = null;

    if (paymentMethodCode === PaymentMethods.MERCADO_PAGO) {
      url = await this.mercadoPagoPaymentGateway.getPaymentUrl(savedOrder);
    }

    const admins = await this.usersRepository.find({ role: Role.ADMIN });

    const userToNotifications = [
      UserToNotification.create({ userId: cart.store.user.id }),
      ...admins.map((user) => UserToNotification.create({ user })),
    ]

    const notification = await this.notificationsRepository.save(Notification.create({
      message: orderStatus.notificationMessage,
      type: NotificationTypes.ORDER_CREATED,
      additionalData: { orderId: savedOrder.id, color: orderStatus.color },
      userToNotifications,
    }));

    const userIds = userToNotifications.map(utn => utn.user?.id ?? userId);

    this.notificationsGateway.notifyUsersById(userIds, notification.toDto());
    await this.notificationsService.notifyUsersById(userIds, notification);

    return {
      order: savedOrder,
      url
    };
  }

  async findOne(id: number, userId: number): Promise<Order> {
    const user = await this.usersRepository.findOne(userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    const queryBuilder = this.ordersRepository.createQueryBuilder('order')
      .innerJoinAndSelect('order.orderStatus', 'orderStatus')
      .innerJoinAndSelect('order.paymentMethod', 'paymentMethod')
      .innerJoinAndSelect('order.store', 'store')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile')
      .leftJoinAndSelect('store.storeHours', 'storeHour')
      .leftJoinAndSelect('order.deliveryMethod', 'deliveryMethod')
      .leftJoinAndSelect('order.delivery', 'delivery')
      .leftJoinAndSelect('delivery.profileAddress', 'profileAddress')
      .innerJoinAndSelect('order.cart', 'cart')
      .leftJoinAndSelect('cart.cartItems', 'cartItem')
      .leftJoinAndSelect('cartItem.cartItemFeatures', 'cartItemFeature')
      .leftJoinAndSelect('cartItem.cartItemShowDetails', 'cartItemShowDetails')
      .leftJoinAndSelect('cartItemShowDetails.show', 'show')
      .leftJoinAndSelect('cartItemShowDetails.zone', 'zone')
      .leftJoinAndSelect('cart.discount', 'discount')
      .leftJoinAndSelect('discount.discountType', 'discountType')
      .leftJoinAndSelect('discount.cards', 'card')
      .leftJoinAndSelect('discount.cardIssuers', 'cardIssuerFromDiscount')
      .leftJoinAndSelect('order.bankTransfers', 'bankTransfer')
      .leftJoinAndSelect('bankTransfer.bankAccount', 'bankAccount')
      .leftJoinAndSelect('bankAccount.cardIssuer', 'cardIssuer')
      .innerJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('user.client', 'client')
      .innerJoinAndSelect('order.orderStatusHistory', 'orderStatusHistory')
      .leftJoinAndSelect('orderStatusHistory.prevOrderStatus', 'prevOrderStatus')
      .innerJoinAndSelect('orderStatusHistory.newOrderStatus', 'newOrderStatus')
      .leftJoinAndSelect('order.orderRejectionReason', 'orderRejectionReason')
      .leftJoinAndSelect('order.productRatings', 'productRating')
      .leftJoinAndSelect('order.deliveryNote', 'deliveryNote')
      .leftJoinAndSelect('order.storeRating', 'storeRating')
      .where('order.id = :orderId', { orderId: id });

    if (user.role === Role.CLIENT) {
      queryBuilder.andWhere('order.userId = :userId', { userId });
    } else if (user.role === Role.STORE) {
      queryBuilder.andWhere('store.userId = :userId', { userId });
    }

    const order = await queryBuilder.getOne();

    if (!order) {
      throw new OrderNotFoundException();
    }

    return order;
  }

  async updateOrderStatus({id, userId, orderStatusCode, reason}: UpdateOrderStatusDto): Promise<Order> {
    const user = await this.usersRepository.findOne(userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    const orderStatus = await this.orderStatusesRepository.findOne({
      code: orderStatusCode,
    });

    if (!orderStatus) {
      throw new OrderStatusNotFoundException();
    }

    const queryBuilder = this.ordersRepository.createQueryBuilder('order')
      .innerJoinAndSelect('order.orderStatus', 'orderStatus')
      .innerJoinAndSelect('order.paymentMethod', 'paymentMethod')
      .innerJoinAndSelect('order.store', 'store')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile')
      .leftJoinAndSelect('store.storeHours', 'storeHour')
      .leftJoinAndSelect('store.user', 'userStore')
      .leftJoinAndSelect('order.deliveryMethod', 'deliveryMethod')
      .leftJoinAndSelect('order.delivery', 'delivery')
      .leftJoinAndSelect('delivery.profileAddress', 'profileAddress')
      .innerJoinAndSelect('order.cart', 'cart')
      .leftJoinAndSelect('cart.cartItems', 'cartItem')
      .leftJoinAndSelect('cartItem.cartItemFeatures', 'cartItemFeature')
      .leftJoinAndSelect('cart.discount', 'discount')
      .leftJoinAndSelect('order.bankTransfers', 'bankTransfer')
      .leftJoinAndSelect('bankTransfer.bankAccount', 'bankAccount')
      .leftJoinAndSelect('bankAccount.cardIssuer', 'cardIssuer')
      .innerJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('user.client', 'client')
      .innerJoinAndSelect('order.orderStatusHistory', 'orderStatusHistory')
      .leftJoinAndSelect('orderStatusHistory.prevOrderStatus', 'prevOrderStatus')
      .innerJoinAndSelect('orderStatusHistory.newOrderStatus', 'newOrderStatus')
      .leftJoinAndSelect('order.orderRejectionReason', 'orderRejectionReason')
      .leftJoinAndSelect('order.productRatings', 'productRating')
      .leftJoinAndSelect('order.storeRating', 'storeRating')
      .where('order.id = :id', { id });

    const order = await queryBuilder.getOne();

    if (!order) {
      throw new OrderNotFoundException();
    }

    const alreadyHasStatusCode = order.orderStatusHistory
      .some(history => history?.prevOrderStatus?.code === orderStatusCode || history.newOrderStatus.code === orderStatusCode);

    if (alreadyHasStatusCode) {
      throw new OrderStatusIsAlreadyInHistoryException();
    }

    const userToNotifications: UserToNotification[] = [];

    switch(orderStatusCode) {
      case OrderStatuses.PAYMENT_ACCEPTED:
      case OrderStatuses.PAYMENT_REJECTED: {
        if (order.orderStatus.code !== OrderStatuses.CONFIRMING_PAYMENT) throw new IncorrectOrderStatusException();

        const paymentMethodIsCardOrCash = order.paymentMethod.code === PaymentMethods.CARD || order.paymentMethod.code === PaymentMethods.CASH;
        if (paymentMethodIsCardOrCash && order.store.user.id !== userId) throw new UserMustBeTheStoreThatOwnsTheProduct();
        else if (!paymentMethodIsCardOrCash && user.role !== Role.ADMIN) throw new UserMustBeAdminException();

        userToNotifications.push(...[
          UserToNotification.create({ userId: order.user.id }),
          UserToNotification.create({ userId: order.store.user.id }),
        ]);
        break;
      }
      case OrderStatuses.SENDING_PRODUCTS: {
        if (order.orderStatus.code !== OrderStatuses.PAYMENT_ACCEPTED) throw new IncorrectOrderStatusException();
        if (order.store.user.id !== userId) throw new UserMustBeTheStoreThatOwnsTheProduct();

        const admins = await this.usersRepository.find({ role: Role.ADMIN });

        userToNotifications.push(...[
          UserToNotification.create({ userId: order.user.id }),
          ...admins.map(user => UserToNotification.create({ userId: user.id })),
        ]);
        break;
      }
      case OrderStatuses.PRODUCTS_SENT:
      case OrderStatuses.SHIPPING_ERROR: {
        if (order.orderStatus.code !== OrderStatuses.SENDING_PRODUCTS) throw new IncorrectOrderStatusException();
        if (order.store.user.id !== userId) throw new UserMustBeTheStoreThatOwnsTheProduct();
        const admins = await this.usersRepository.find({ role: Role.ADMIN });

        userToNotifications.push(...[
          UserToNotification.create({ userId: order.store.user.id }),
          ...admins.map(user => UserToNotification.create({ userId: user.id })),
        ]);
        break;
      }
      case OrderStatuses.PRODUCTS_RECEIVED: {
        if (order.orderStatus.code !== OrderStatuses.PRODUCTS_SENT && order.orderStatus.code !== OrderStatuses.WAITING_FOR_PICKUP_AT_STORE) {
          throw new IncorrectOrderStatusException();
        }

        if (order.user.id !== userId) throw new UserMustBeTheBuyer();
        const admins = await this.usersRepository.find({ role: Role.ADMIN });

        userToNotifications.push(...[
          UserToNotification.create({ userId: order.store.user.id }),
          ...admins.map(user => UserToNotification.create({ userId: user.id })),
        ]);
        break;
      }
      default:
        throw new UnauthorizedException();
    }

    order.orderStatusHistory.push(OrderStatusHistory.create({
      prevOrderStatus: order.orderStatus,
      newOrderStatus: orderStatus,
    }));

    let finalStatus = orderStatus;

    if (orderStatus.code === OrderStatuses.PAYMENT_ACCEPTED && !order.delivery) {
      const newOrderStatus = await this.orderStatusesRepository.findOne({ code: OrderStatuses.WAITING_FOR_PICKUP_AT_STORE });

      if (!newOrderStatus) throw new OrderStatusNotFoundException();

      order.orderStatusHistory.push(OrderStatusHistory.create({
        prevOrderStatus: orderStatus,
        newOrderStatus,
      }));

      finalStatus = newOrderStatus;
    }

    order.orderStatus = finalStatus;

    if (orderStatus.requiresReason) {
      order.orderRejectionReason = OrderRejectionReason.create({ reason });
    }

    const notification = await this.notificationsRepository.save(Notification.create({
      message: finalStatus.notificationMessage.replace('[order_number]', order.orderNumber),
      type: NotificationTypes.ORDER_STATUS_CHANGE,
      additionalData: { orderId: order.id, color: finalStatus.color },
      userToNotifications,
    }));

    const userIds = userToNotifications.map(utn => utn.userId);

    this.notificationsGateway.notifyUsersById(userIds, notification.toDto());
    this.notificationsService.notifyUsersById(userIds, notification);

    return await this.ordersRepository.save(order);
  }

  async ordersCount(userId: number): Promise<OrdersCountDto> {
    const user = await this.usersRepository.findOne(userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    const queryBuilder = this.ordersRepository.createQueryBuilder('order')
      .innerJoin('order.store', 'store')
      .innerJoin('order.orderStatus', 'orderStatus');

    if (user.role === Role.CLIENT) {
      queryBuilder.andWhere('order.userId = :userId', { userId });
    } else if (user.role === Role.STORE) {
      queryBuilder.andWhere('store.userId = :userId', { userId });
    }

    const processing = await queryBuilder
      .clone()
      .andWhere('orderStatus.code IN (:...code)', { code: [
        OrderStatuses.CONFIRMING_PAYMENT,
        OrderStatuses.PAYMENT_ACCEPTED,
        OrderStatuses.SENDING_PRODUCTS,
        OrderStatuses.PRODUCTS_SENT,
        OrderStatuses.WAITING_FOR_PICKUP_AT_STORE,
      ]})
      .getCount();

    const completed = await queryBuilder
      .clone()
      .andWhere('orderStatus.code IN (:...code)', { code: [
        OrderStatuses.PRODUCTS_RECEIVED,
      ]})
      .getCount();

    const canceled = await queryBuilder
      .clone()
      .andWhere('orderStatus.code IN (:...code)', { code: [
        OrderStatuses.PAYMENT_REJECTED,
        OrderStatuses.SHIPPING_ERROR,
      ]})
      .getCount();

    return {
      processing,
      completed,
      canceled,
    };
  }
}

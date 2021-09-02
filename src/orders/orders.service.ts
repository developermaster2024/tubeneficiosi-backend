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
import { LessThan, Repository } from 'typeorm';
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

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Cart) private readonly cartsRepository: Repository<Cart>,
    @InjectRepository(DeliveryZone) private readonly deliveryZoneRepository: Repository<DeliveryZone>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Product) private readonly productsRepository: Repository<Product>,
    @InjectRepository(DeliveryMethod) private readonly deliveryMethodsRepository: Repository<DeliveryMethod>,
    @InjectRepository(OrderStatus) private readonly orderStatusesRepository: Repository<OrderStatus>,
    @InjectRepository(Notification) private readonly notificationsRepository: Repository<Notification>,
    private readonly deliveryCostCalculatorResolver: DeliveryCostCalculatorResolver,
    private readonly notificationsGateway: NotificationsGateway
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
  }}: OrderPaginationOptionsDto, userId: number): Promise<PaginationResult<Order>> {
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
      .leftJoinAndSelect('order.bankTransfers', 'bankTransfer')
      .leftJoinAndSelect('bankTransfer.bankAccount', 'bankAccount')
      .leftJoinAndSelect('bankAccount.cardIssuer', 'cardIssuer')
      .innerJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('user.client', 'client')
      .innerJoinAndSelect('order.orderStatusHistory', 'orderStatusHistory')
      .leftJoinAndSelect('orderStatusHistory.prevOrderStatus', 'prevOrderStatus')
      .innerJoinAndSelect('orderStatusHistory.newOrderStatus', 'newOrderStatus')
      .leftJoinAndSelect('order.orderRejectionReason', 'orderRejectionReason');

    if (user.role === Role.CLIENT) {
      queryBuilder.andWhere('order.userId = :userId', { userId });
    } else if (user.role === Role.STORE) {
      queryBuilder.andWhere('store.userId = :userId', { userId });
    }

    if (id) queryBuilder.andWhere('order.id = :id', { id });

    if (orderNumber) queryBuilder.andWhere('order.orderNumber = :orderNumber', { orderNumber });

    if (address) queryBuilder.andWhere('profileAddress.address LIKE :address', { address: `%${address}%` });

    if (storeName) queryBuilder.andWhere('store.name LIKE :storeName', { storeName: `%${storeName}%` });

    // @TODO: Agregar filtro por totales

    if (minDate) queryBuilder.andWhere('order.createdAt >= :minDate', { minDate });

    if (maxDate) queryBuilder.andWhere('order.createdAt <= :maxDate', { maxDate });

    if (orderStatusCode) queryBuilder.andWhere('order.orderStatusCode = :orderStatusCode', { orderStatusCode });

    if (paymentMethodCode) queryBuilder.andWhere('order.paymentMethodCode = :paymentMethodCode', { paymentMethodCode });

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
  }: CreateOrderDto): Promise<Order> {
    const order = Order.create({});

    const cart = await this.cartsRepository.createQueryBuilder('cart')
      .innerJoinAndSelect('cart.user', 'user')
      .leftJoinAndSelect('user.client', 'client')
      .innerJoinAndSelect('cart.store', 'store')
      .innerJoinAndSelect('store.user', 'storeUser')
      .leftJoinAndSelect('store.storeHours', 'storeHour')
      .leftJoinAndSelect('cart.cartItems', 'cartItem')
      .leftJoinAndSelect('cartItem.cartItemFeatures', 'cartItemFeature')
      .leftJoinAndSelect('cartItem.product', 'product')
      .leftJoinAndSelect('product.productDimensions', 'productDimensions')
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
      const product = await this.productsRepository.findOne({
        id: cartItem.productId,
        quantity: LessThan(cartItem.quantity),
      });

      if (product) {
        throw new ProductQuantityIsLessThanRequiredQuantityException(cartItem);
      }
    }

    const lastOrder = await this.ordersRepository.findOne({ order: { id: 'DESC' } });
    order.orderNumber = (lastOrder ? +lastOrder.orderNumber + 1 : 1).toString().padStart(6, '0');
    order.cart = cart;
    order.storeId = cart.store.id;
    order.userId = cart.user.id;
    order.orderStatusCode = OrderStatuses.CONFIRMING_PAYMENT;
    order.paymentMethodCode = paymentMethodCode;
    order.orderStatusHistory = [OrderStatusHistory.create({newOrderStatusCode: OrderStatuses.CONFIRMING_PAYMENT})];

    if (deliveryMethodId) {
      order.deliveryMethodId = deliveryMethodId;

      const deliveryZone = await this.deliveryZoneRepository.createQueryBuilder('deliveryZone')
        .innerJoin('deliveryZone.deliveryMethod', 'deliveryMethod')
        .where(`EXISTS(
          SELECT
            lo.id
          FROM
            delivery_zone_to_location dztl
          INNER JOIN
            locations lo ON lo.id = dztl.location_id
          WHERE ST_CONTAINS(lo.area, (
            SELECT
              POINT(address.latitude, address.longitude)
            FROM
              client_addresses address
            WHERE
              address.id = :addressId AND address.deleted_at IS NULL
            LIMIT 1
          )) AND dztl.delivery_zone_id = deliveryZone.id
        )`, { addressId: profileAddressId })
        .andWhere('deliveryMethod.id = :deliveryMethodId', { deliveryMethodId })
        .getOne();

      if (!deliveryZone) {
        throw new DeliveryZoneNotFoundException();
      }

      const deliveryMethod = await this.deliveryMethodsRepository.findOne({
        select: ['id', 'deliveryMethodTypeCode'],
        where: { id: deliveryMethodId },
      });

      if (!deliveryMethod) {
        throw new DeliveryMethodNotFoundException();
      }

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

    if (paymentMethodCode === PaymentMethods.BANK_TRANSFER || paymentMethodCode === PaymentMethods.CASH) {
      order.bankTransfers = bankTransfers.map(bankTransfer => BankTransfer.create(bankTransfer));

      const bankTransfersTotal = order.bankTransfers.reduce((total, transfer) => Number(total) + Number(transfer.amount), 0);

      if (bankTransfersTotal > order.total) {
        throw new PaymentExceedsTotalException();
      } else if (bankTransfersTotal < order.total) {
        throw new PaymentBelowTotalException();
      }
    }

    if (paymentMethodCode === PaymentMethods.MERCADO_PAGO) {
      // @TODO: Crear url de mercado pago
    }

    cart.isProcessed = true;
    await this.cartsRepository.save(cart);

    await this.productsRepository.createQueryBuilder('product')
      .update(Product)
      .set({
        quantity: () => `
          products.quantity - (SELECT
            cart_items.quantity
          FROM
            cart_items
          WHERE
            cart_items.product_id = products.id AND
            cart_items.cart_id = ${cart.id}
          LIMIT
            1
          )
        `
      })
      .where('id IN (:...ids)', { ids: cart.cartItems.map(item => item.productId) })
      .execute();

    const savedOrder = await this.ordersRepository.save(order);

    const admins = await this.usersRepository.find({ role: Role.ADMIN });

    const notification = await this.notificationsRepository.save(Notification.create({
      message: '¡Orden creada!',
      type: NotificationTypes.ORDER_CREATED,
      additionalData: { orderId: savedOrder.id },
      userToNotifications: [
        UserToNotification.create({ userId: cart.store.user.id }),
        ...admins.map((user) => UserToNotification.create({ user })),
      ],
    }));

    this.notificationsGateway.notifyUsersById([cart.store.user.id], notification.toDto());

    this.notificationsGateway.notifyUsersByRole([Role.ADMIN], notification.toDto());

    return savedOrder;
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
      .leftJoinAndSelect('order.bankTransfers', 'bankTransfer')
      .leftJoinAndSelect('bankTransfer.bankAccount', 'bankAccount')
      .leftJoinAndSelect('bankAccount.cardIssuer', 'cardIssuer')
      .innerJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('user.client', 'client')
      .innerJoinAndSelect('order.orderStatusHistory', 'orderStatusHistory')
      .leftJoinAndSelect('orderStatusHistory.prevOrderStatus', 'prevOrderStatus')
      .innerJoinAndSelect('orderStatusHistory.newOrderStatus', 'newOrderStatus')
      .leftJoinAndSelect('order.orderRejectionReason', 'orderRejectionReason')
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
      .leftJoinAndSelect('order.bankTransfers', 'bankTransfer')
      .leftJoinAndSelect('bankTransfer.bankAccount', 'bankAccount')
      .leftJoinAndSelect('bankAccount.cardIssuer', 'cardIssuer')
      .innerJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('user.client', 'client')
      .innerJoinAndSelect('order.orderStatusHistory', 'orderStatusHistory')
      .leftJoinAndSelect('orderStatusHistory.prevOrderStatus', 'prevOrderStatus')
      .innerJoinAndSelect('orderStatusHistory.newOrderStatus', 'newOrderStatus')
      .leftJoinAndSelect('order.orderRejectionReason', 'orderRejectionReason')
      .where('order.id = :id', { id })

    const order = await queryBuilder.getOne();

    if (!order) {
      throw new OrderNotFoundException();
    }

    const alreadyHasStatusCode = order.orderStatusHistory
      .some(history => history?.prevOrderStatus?.code === orderStatusCode || history.newOrderStatus.code === orderStatusCode);

    if (alreadyHasStatusCode) {
      throw new OrderStatusIsAlreadyInHistoryException();
    }

    switch(orderStatusCode) {
      case OrderStatuses.PAYMENT_ACCEPTED:
      case OrderStatuses.PAYMENT_REJECTED: {
        if (order.orderStatus.code !== OrderStatuses.CONFIRMING_PAYMENT) throw new IncorrectOrderStatusException();
        if (user.role !== Role.ADMIN) throw new UserMustBeAdminException();
        const userToNotifications = [
          UserToNotification.create({ user: order.user }),
          UserToNotification.create({ user: order.store.user }),
        ];

        const notification = await this.notificationsRepository.save(Notification.create({
          message: `¡Estatus de Orden cambiado a ${orderStatus.name}`,
          type: NotificationTypes.ORDER_STATUS_CHANGE,
          additionalData: { orderId: order.id },
          userToNotifications,
        }));

        this.notificationsGateway.notifyUsersById(userToNotifications.map(ustn => ustn.user.id), notification);
        break;
      }
      case OrderStatuses.SENDING_PRODUCTS: {
        if (order.orderStatus.code !== OrderStatuses.PAYMENT_ACCEPTED) throw new IncorrectOrderStatusException();
        if (order.store.user.id !== userId) throw new UserMustBeTheStoreThatOwnsTheProduct();

        const admins = await this.usersRepository.find({ role: Role.ADMIN });

        const userToNotifications = [
          UserToNotification.create({ user: order.user }),
          ...admins.map(user => UserToNotification.create({ user })),
        ];

        const notification = await this.notificationsRepository.save(Notification.create({
          message: `¡Estatus de Orden cambiado a ${orderStatus.name}`,
          type: NotificationTypes.ORDER_STATUS_CHANGE,
          additionalData: { orderId: order.id },
          userToNotifications,
        }));

        this.notificationsGateway.notifyUsersById([order.user.id], notification.toDto());
        this.notificationsGateway.notifyUsersByRole([Role.ADMIN], notification.toDto());
        break;
      }
      case OrderStatuses.PRODUCTS_SENT:
      case OrderStatuses.SHIPPING_ERROR: {
        if (order.orderStatus.code !== OrderStatuses.SENDING_PRODUCTS) throw new IncorrectOrderStatusException();
        if (order.store.user.id !== userId) throw new UserMustBeTheStoreThatOwnsTheProduct();
        const admins = await this.usersRepository.find({ role: Role.ADMIN });

        const userToNotifications = [
          UserToNotification.create({ user: order.store.user }),
          ...admins.map(user => UserToNotification.create({ user })),
        ];

        const notification = await this.notificationsRepository.save(Notification.create({
          message: `¡Estatus de Orden cambiado a ${orderStatus.name}`,
          type: NotificationTypes.ORDER_STATUS_CHANGE,
          additionalData: { orderId: order.id },
          userToNotifications,
        }));

        this.notificationsGateway.notifyUsersById([order.user.id], notification.toDto());
        this.notificationsGateway.notifyUsersByRole([Role.ADMIN], notification.toDto());
        break;
      }
      case OrderStatuses.PRODUCTS_RECEIVED: {
        if (order.orderStatus.code !== OrderStatuses.PRODUCTS_SENT) throw new IncorrectOrderStatusException();
        if (order.user.id !== userId) throw new UserMustBeTheBuyer();
        const admins = await this.usersRepository.find({ role: Role.ADMIN });

        const userToNotifications = [
          UserToNotification.create({ user: order.store.user }),
          ...admins.map(user => UserToNotification.create({ user })),
        ];

        const notification = await this.notificationsRepository.save(Notification.create({
          message: `¡Estatus de Orden cambiado a ${orderStatus.name}`,
          type: NotificationTypes.ORDER_STATUS_CHANGE,
          additionalData: { orderId: order.id },
          userToNotifications,
        }));

        this.notificationsGateway.notifyUsersById([order.store.user.id], notification.toDto());
        this.notificationsGateway.notifyUsersByRole([Role.ADMIN], notification.toDto());
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

    return await this.ordersRepository.save(order);
  }
}

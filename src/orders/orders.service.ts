import { Injectable } from '@nestjs/common';
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

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Cart) private readonly cartsRepository: Repository<Cart>,
    @InjectRepository(DeliveryZone) private readonly deliveryZoneRepository: Repository<DeliveryZone>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>
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
      .leftJoinAndSelect('order.deliveryMethod', 'deliveryMethod')
      .leftJoinAndSelect('order.delivery', 'delivery')
      .leftJoinAndSelect('delivery.profileAddress', 'profileAddress')
      .innerJoinAndSelect('order.cart', 'cart')
      .leftJoinAndSelect('cart.cartItems', 'cartItem')
      .leftJoinAndSelect('cartItem.cartItemFeatures', 'cartItemFeature')
      .leftJoinAndSelect('order.bankTransfers', 'bankTransfer');

    if (user.role === Role.CLIENT) {
      queryBuilder.andWhere('order.clientId = :userId', { userId });
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

    // @TODO: Hay que validar que la cantidad de los productos sea suficiente para satisfacer la orden

    const cart = await this.cartsRepository.createQueryBuilder('cart')
      .innerJoinAndSelect('cart.user', 'user')
      .innerJoinAndSelect('cart.store', 'store')
      .leftJoinAndSelect('cart.cartItems', 'cartItem')
      .leftJoinAndSelect('cartItem.cartItemFeatures', 'cartItemFeature')
      .where('cart.id = :cartId', { cartId })
      .andWhere('cart.userId = :userId', { userId })
      .andWhere('cart.isProcessed = :isProcessed', { isProcessed: 0 })
      .andWhere(':today < cart.expiresOn', { today: new Date() })
      .getOne();

    if (!cart) {
      throw new CartNotFoundException();
    }

    cart.isProcessed = true;

    await this.cartsRepository.save(cart);

    const lastOrder = await this.ordersRepository.findOne({ order: { id: 'DESC' } });
    order.orderNumber = (lastOrder ? +lastOrder.orderNumber + 1 : 1).toString().padStart(6, '0');
    order.cart = cart;
    order.storeId = cart.store.id;
    order.clientId = cart.user.id;
    order.orderStatusCode = OrderStatuses.PENDING;
    order.paymentMethodCode = paymentMethodCode;

    // @TODO: Hay que disminuir la cantidad del producto después de crear la orden

    if (deliveryMethodId) {
      order.deliveryMethodId = deliveryMethodId;

      const deliveryZone = await this.deliveryZoneRepository.createQueryBuilder('deliveryZone')
        .innerJoin('deliveryZone.deliveryMethod', 'deliveryMethod')
        .where(`EXISTS(
          SELECT lo.id FROM locations lo WHERE ST_CONTAINS(lo.area, (
            SELECT
              POINT(address.latitude, address.longitude)
            FROM
              client_addresses address
            WHERE
              address.id = :addressId AND address.deleted_at IS NULL
            LIMIT 1
          ))
        )`, { addressId: profileAddressId })
        .andWhere('deliveryMethod.id = :deliveryMethodId', { deliveryMethodId })
        .getOne();

      if (!deliveryZone) {
        throw new DeliveryZoneNotFoundException();
      }

      order.delivery = Delivery.create({
        profileAddressId,
        deliveryZone,
        deliveryZoneId: 49,
        // @TODO: Calcular el costo de envío
        total: 0,
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

    return await this.ordersRepository.save(order);
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.createQueryBuilder('order')
      .innerJoinAndSelect('order.orderStatus', 'orderStatus')
      .innerJoinAndSelect('order.paymentMethod', 'paymentMethod')
      .innerJoinAndSelect('order.store', 'store')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile')
      .leftJoinAndSelect('order.deliveryMethod', 'deliveryMethod')
      .leftJoinAndSelect('order.delivery', 'delivery')
      .innerJoinAndSelect('order.cart', 'cart')
      .leftJoinAndSelect('cart.cartItems', 'cartItem')
      .leftJoinAndSelect('cartItem.cartItemFeatures', 'cartItemFeature')
      .leftJoinAndSelect('order.bankTransfers', 'bankTransfer')
      .where('order.id = :orderId', { orderId: id })
      .getOne();

    if (!order) {
      throw new OrderNotFoundException();
    }

    return order;
  }
}

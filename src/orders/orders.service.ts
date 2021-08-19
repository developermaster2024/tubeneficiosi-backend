import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankTransfer } from 'src/bank-transfers/entities/bank-transfer.entity';
import { Cart } from 'src/carts/entities/cart.entity';
import { CartNotFoundException } from 'src/carts/errors/cart-not-found.exception';
import { DeliveryZoneNotFoundException } from 'src/delivery-methods/errors/delivery-zone-not-found.exception';
import { PaymentBelowTotalException } from 'src/carts/errors/payment-bellow-total.exception';
import { PaymentExceedsTotalException } from 'src/carts/errors/payment-exceeds-total.exception';
import { Delivery } from 'src/deliveries/entities/delivery.entity';
import { DeliveryMethod } from 'src/delivery-methods/entities/delivery-method.entity';
import { DeliveryZone } from 'src/delivery-methods/entities/delivery-zone.entity';
import { OrderStatuses } from 'src/order-statuses/enums/order-statuses.enum';
import { PaymentMethods } from 'src/payment-methods/enum/payment-methods.enum';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Cart) private readonly cartsRepository: Repository<Cart>,
    @InjectRepository(DeliveryZone) private readonly deliveryZoneRepository: Repository<DeliveryZone>,
  ) {}

  async create({
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
      .andWhere('cart.isProcessed = :isProcessed', { isProcessed: 0 })
      .andWhere(':today < cart.expiresOn', { today: new Date() })
      .getOne();

    if (!cart) {
      throw new CartNotFoundException();
    }

    cart.isProcessed = true;

    await this.cartsRepository.save(cart);

    // @TODO: Hay que crear un correlativo
    order.orderNumber = 'asdf';
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
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: [
        'orderStatus',
        'paymentMethod',
        'deliveryMethod',
        'cart',
        'cart.cartItems',
        'cart.cartItems.cartItemFeatures',
        'bankTransfers',
      ],
    });

    if (!order) {
      // throw new OrderNotFoundException();
    }

    return order;
  }
}

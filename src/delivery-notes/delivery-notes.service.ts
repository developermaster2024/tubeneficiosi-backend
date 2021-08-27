import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatuses } from 'src/order-statuses/enums/order-statuses.enum';
import { Order } from 'src/orders/entities/order.entity';
import { OrderNotFoundException } from 'src/orders/errors/order-not-found.exception';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/roles.enum';
import { UserNotFoundException } from 'src/users/errors/user-not-found.exception';
import { Repository } from 'typeorm';
import { CreateDeliveryNoteDto } from './dto/create-delivery-note.dto';
import { DeliveryNotePaginationOptionsDto } from './dto/delivery-note-pagination-options.dto';
import { DeliveryNote } from './entities/delivery-note.entity';
import { DeliveryNoteNotFoundException } from './errors/delivery-note-not-found.exception';
import { UnableToAssignOrderStatusException } from './errors/unable-to-assign-order-status.exception';

@Injectable()
export class DeliveryNotesService {
  constructor(
    @InjectRepository(DeliveryNote) private readonly deliveryNotesRepository: Repository<DeliveryNote>,
    @InjectRepository(Order) private readonly ordersRepository: Repository<Order>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>
  ) {}

  async paginate({perPage, offset, filters: {
    id,
  }}: DeliveryNotePaginationOptionsDto, userId: number): Promise<PaginationResult<DeliveryNote>> {
    const user = await this.usersRepository.findOne(userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    const queryBuilder = this.deliveryNotesRepository.createQueryBuilder('deliveryNote')
      .innerJoinAndSelect('deliveryNote.order', 'order')
      .innerJoinAndSelect('order.orderStatus', 'orderStatus')
      .innerJoinAndSelect('order.paymentMethod', 'paymentMethod')
      .innerJoinAndSelect('order.store', 'store')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile')
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
      .take(perPage)
      .skip(offset);

    if (user.role === Role.CLIENT) {
      queryBuilder.andWhere('user.id = :userId', { userId });
    } else if (user.role === Role.STORE) {
      queryBuilder.andWhere('store.userId = :userId', { userId });
    }

    if (id) queryBuilder.andWhere('deliveryNote.id = :id', { id });

    const [deliveryNotes, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(deliveryNotes, total, perPage);
  }

  async create({orderId, userId, ...createDeliveryNoteDto}: CreateDeliveryNoteDto): Promise<DeliveryNote> {
    const order = await this.ordersRepository.createQueryBuilder('order')
      .innerJoinAndSelect('order.orderStatus', 'orderStatus')
      .innerJoinAndSelect('order.paymentMethod', 'paymentMethod')
      .innerJoinAndSelect('order.store', 'store')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile')
      .leftJoinAndSelect('store.user', 'userStore')
      .leftJoinAndSelect('order.deliveryMethod', 'deliveryMethod')
      .innerJoinAndSelect('order.delivery', 'delivery')
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
      .where('order.id = :orderId', { orderId })
      .andWhere('store.userId = :userId', { userId })
      .andWhere(`NOT EXISTS(
        SELECT
          dn.id
        FROM
          delivery_notes dn
        WHERE
          dn.order_id = :orderId
      )`, { orderId })
      .getOne();

    if (!order) {
      throw new OrderNotFoundException();
    }

    if (order.orderStatus.code !== OrderStatuses.SENDING_PRODUCTS) {
      throw new UnableToAssignOrderStatusException();
    }

    const deliveryNote = DeliveryNote.create({
      ...createDeliveryNoteDto,
      order,
    });

    return await this.deliveryNotesRepository.save(deliveryNote);
  }

  async findOne(id: number, userId: number): Promise<DeliveryNote> {
    const user = await this.usersRepository.findOne(userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    const queryBuilder = this.deliveryNotesRepository.createQueryBuilder('deliveryNote')
      .innerJoinAndSelect('deliveryNote.order', 'order')
      .innerJoinAndSelect('order.orderStatus', 'orderStatus')
      .innerJoinAndSelect('order.paymentMethod', 'paymentMethod')
      .innerJoinAndSelect('order.store', 'store')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile')
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
      .where('deliveryNote.id = :id', { id });

    if (user.role === Role.CLIENT) {
      queryBuilder.andWhere('user.id = :userId', { userId });
    } else if (user.role === Role.STORE) {
      queryBuilder.andWhere('store.userId = :userId', { userId });
    }

    const deliveryNote = await queryBuilder.getOne();

    if (!deliveryNote) {
      throw new DeliveryNoteNotFoundException();
    }

    return deliveryNote;
  }
}

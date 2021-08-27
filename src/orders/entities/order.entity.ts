import { BankTransfer } from "src/bank-transfers/entities/bank-transfer.entity";
import { Cart } from "src/carts/entities/cart.entity";
import { Delivery } from "src/deliveries/entities/delivery.entity";
import { DeliveryMethod } from "src/delivery-methods/entities/delivery-method.entity";
import { OrderStatus } from "src/order-statuses/entities/order-status.entity";
import { OrderStatuses } from "src/order-statuses/enums/order-statuses.enum";
import { PaymentMethod } from "src/payment-methods/entities/payment-method.entity";
import { PaymentMethods } from "src/payment-methods/enum/payment-methods.enum";
import { Store } from "src/stores/entities/store.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderStatusHistory } from "./order-status-history.entity";

@Entity({
  name: 'orders',
})
export class Order {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'order_number',
    type: 'varchar',
  })
  orderNumber: string;

  @Column({
    name: 'order_status_code',
    type: 'varchar',
    length: 20,
  })
  orderStatusCode: OrderStatuses;

  @ManyToOne(() => OrderStatus, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({name: 'order_status_code'})
  orderStatus: OrderStatus;

  @Column({
    name: 'store_id',
    type: 'int',
    select: false,
  })
  storeId: number;

  @ManyToOne(() => Store, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'store_id'})
  store: Store;

  @Column({
    name: 'user_id',
    type: 'int',
    select: false,
  })
  userId: number;

  @ManyToOne(() => User, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'user_id'})
  user: User;

  @Column({
    name: 'payment_method_code',
    type: 'varchar',
    select: false,
  })
  paymentMethodCode: PaymentMethods;

  @ManyToOne(() => PaymentMethod, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'payment_method_code'})
  paymentMethod: PaymentMethod;

  @Column({
    name: 'delivery_method_id',
    type: 'int',
    select: false,
    nullable: true,
  })
  deliveryMethodId: number;

  @ManyToOne(() => DeliveryMethod, {nullable: true, onDelete: 'CASCADE'})
  @JoinColumn({name: 'delivery_method_id'})
  deliveryMethod: DeliveryMethod;

  @OneToOne(() => Delivery, delivery => delivery.order, { cascade: ['insert', 'update'] })
  delivery: Delivery;

  @Column({
    name: 'cart_id',
    type: 'int',
    select: false,
  })
  cartId: number;

  @OneToOne(() => Cart, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @OneToMany(() => BankTransfer, bankTransfer => bankTransfer.order, {cascade: true, onDelete: 'CASCADE'})
  bankTransfers: BankTransfer[];

  @OneToMany(() => OrderStatusHistory, (history) => history.order, { cascade: ['insert', 'update'] })
  orderStatusHistory: OrderStatusHistory[];

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    select: false,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    select: false
  })
  deletedAt: Date;

  get total(): number {
    if (this.delivery) {
      return Number(this.cart.subTotal +  this.delivery.total);
    }

    return +this.cart.subTotal;
  }

  static create(data: Partial<Order>): Order {
    return Object.assign(new Order(), data);
  }
}

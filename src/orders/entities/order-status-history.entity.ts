import { OrderStatus } from "src/order-statuses/entities/order-status.entity";
import { OrderStatuses } from "src/order-statuses/enums/order-statuses.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity({
  name: 'order_status_histories',
})
export class OrderStatusHistory {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'prev_order_status_code',
    type: 'varchar',
    length: 20,
    nullable: true,
    select: false,
  })
  prevOrderStatusCode: OrderStatuses;

  @ManyToOne(() => OrderStatus, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'prev_order_status_code' })
  prevOrderStatus: OrderStatus;

  @Column({
    name: 'new_order_status_code',
    type: 'varchar',
    length: 20,
    nullable: false,
    select: false,
  })
  newOrderStatusCode: OrderStatuses;

  @ManyToOne(() => OrderStatus, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'new_order_status_code' })
  newOrderStatus: OrderStatus;

  @Column({
    name: 'order_id',
    type: 'int',
    nullable: false,
  })
  orderId: number;

  @ManyToOne(() => Order, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  static create(data: Partial<OrderStatusHistory>): OrderStatusHistory {
    return Object.assign(new OrderStatusHistory(), data);
  }
}

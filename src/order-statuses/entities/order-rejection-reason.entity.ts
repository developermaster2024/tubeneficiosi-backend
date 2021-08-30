import { Order } from "src/orders/entities/order.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: 'order_rejection_reasons',
})
export class OrderRejectionReason {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'reason',
    type: 'varchar',
  })
  reason: string;

  @Column({
    name: 'order_id',
    type: 'int',
    select: false,
  })
  orderId: number;

  @OneToOne(() => Order, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  static create(data: Partial<OrderRejectionReason>): OrderRejectionReason {
    return Object.assign(new OrderRejectionReason(), data);
  }
}

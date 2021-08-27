import { Role } from "src/users/enums/roles.enum";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatuses } from "../enums/order-statuses.enum";
import { OrderStatus } from "./order-status.entity";

@Entity({
  name: 'order_status_to_order_status',
})
export class OrderStatusToOrderStatus {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'order_status_code',
    type: 'varchar',
    length: 20,
  })
  orderStatusCode: OrderStatuses;

  @ManyToOne(() => OrderStatus, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_status_code' })
  orderStatus: OrderStatus;

  @Column({
    name: 'allowed_order_status_code',
    type: 'varchar',
    length: 20,
  })

  @ManyToOne(() => OrderStatus, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'allowed_order_status_code' })
  allowedOrderStatus: OrderStatus;

  @Column({
    name: 'role',
    type: 'varchar',
    length: 50,
  })
  role: Role;
}

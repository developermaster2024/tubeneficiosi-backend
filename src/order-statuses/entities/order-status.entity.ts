import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { OrderStatuses } from "../enums/order-statuses.enum";
import { OrderStatusToOrderStatus } from "./order-status-to-order-status.entity";

@Entity({
  name: 'order_statuses',
})
export class OrderStatus {
  @PrimaryColumn({
    name: 'code',
    type: 'varchar',
    length: 20,
  })
  code: OrderStatuses;

  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;

  @Column({
    name: 'color',
    type: 'varchar',
  })
  color: string;

  @Column({
    name: 'requires_reason',
    type: 'boolean',
  })
  requiresReason: boolean;

  @Column({
    name: 'notification_message',
    type: 'varchar',
  })
  notificationMessage: string;

  @OneToMany(() => OrderStatusToOrderStatus, ostos => ostos.orderStatus)
  allowedOrderStatuses: OrderStatusToOrderStatus[];
}

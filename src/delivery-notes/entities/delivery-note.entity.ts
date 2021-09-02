import { Order } from "src/orders/entities/order.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'delivery_notes',
})
export class DeliveryNote {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'tracking_number',
    type: 'varchar',
    nullable: true,
  })
  trackingNumber: string;

  @Column({
    name: 'url',
    type: 'varchar',
    nullable: true,
  })
  url: string;

  @Column({
    name: 'order_id',
    type: 'int',
    select: false,
  })
  orderId: number;

  @OneToOne(() => Order, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

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

  static create(data: Partial<DeliveryNote>): DeliveryNote {
    return Object.assign(new DeliveryNote(), data);
  }
}

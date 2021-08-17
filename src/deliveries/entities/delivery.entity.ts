import { DeliveryZone } from "src/delivery-methods/entities/delivery-zone.entity";
import { Order } from "src/orders/entities/order.entity";
import { ProfileAddress } from "src/profile-addresses/entities/profile-address.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: 'delivery',
})
export class Delivery {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'total',
    type: 'decimal',
    precision: 19,
    scale: 4,
  })
  total: number;

  @Column({
    name: 'profile_address_id',
    type: 'int',
    select: false,
  })
  profileAddressId: number;

  @ManyToOne(() => ProfileAddress, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_address_id' })
  profileAddress: ProfileAddress;

  @Column({
    name: 'order_id',
    type: 'int',
    select: false,
  })
  orderId: number;

  @OneToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({
    name: 'delivery_zone_id',
    type: 'int',
    select: false,
  })
  deliveryZoneId: number;

  @ManyToOne(() => DeliveryZone, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'delivery_zone_id' })
  deliveryZone: DeliveryZone;

  static create(data: Partial<Delivery>): Delivery {
    return Object.assign(new Delivery(), data);
  }
}

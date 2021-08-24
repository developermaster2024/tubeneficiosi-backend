import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DeliveryZone } from "./delivery-zone.entity";
import { ShippingRange } from "./shipping-range.entity";

@Entity({
  name: 'delivery_zone_to_shipping_range',
})
export class DeliveryZoneToShippingRange {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 19,
    scale: 0,
  })
  price: number;

  @ManyToOne(() => DeliveryZone, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'delivery_zone_id'})
  deliveryZone: DeliveryZone;

  @Column({
    name: 'delivery_range_id',
    type: 'int',
    nullable: false,
  })
  shippingRangeId: number;

  @ManyToOne(() => ShippingRange, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'delivery_range_id'})
  shippingRange: ShippingRange;

  static create(data: Partial<DeliveryZoneToShippingRange>): DeliveryZoneToShippingRange {
    return Object.assign(new DeliveryZoneToShippingRange(), data);
  }
}

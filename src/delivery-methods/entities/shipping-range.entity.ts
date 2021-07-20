import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DeliveryMethod } from "./delivery-method.entity";
import { DeliveryZoneToShippingRange } from "./delivery-zone-to-shipping-range.entity";

@Entity({
  name: 'shipping_ranges',
})
export class ShippingRange {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'weight_from',
    type: 'int',
  })
  weightFrom: number;

  @Column({
    name: 'weight_to',
    type: 'int'
  })
  weightTo: number;

  @Column({
    name: 'volume_from',
    type: 'decimal',
    precision: 12,
    scale: 4
  })
  volumeFrom: number;

  @Column({
    name: 'volume_to',
    type: 'decimal',
    precision: 12,
    scale: 4
  })
  volumeTo: number;

  @Column({
    name: 'position',
    type: 'int',
  })
  position: number;

  @Column({
    name: 'delivery_method_id',
    type: 'int',
    select: false,
  })
  deliveryMethodId: number;

  @ManyToOne(() => DeliveryMethod, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'delivery_method_id'})
  deliveryMethod: DeliveryMethod;

  @OneToMany(() => DeliveryZoneToShippingRange, deliveryZoneToShippingRange => deliveryZoneToShippingRange.shippingRange, {cascade: ['insert', 'update']})
  deliveryZoneToShippingRange: DeliveryZoneToShippingRange[];

  static create(data: Partial<ShippingRange>): ShippingRange {
    return Object.assign(new ShippingRange(), data);
  }
}

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DeliveryRange } from "./delivery-range.entity";
import { DeliveryZone } from "./delivery-zone.entity";

@Entity({
  name: 'delivery_zone_to_delivery_range',
})
export class DeliveryZoneToDeliveryRange {
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
  })
  deliveryRangeId: number;

  @ManyToOne(() => DeliveryRange, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'delivery_range_id'})
  deliveryRange: DeliveryRange;

  static create(data: Partial<DeliveryZoneToDeliveryRange>): DeliveryZoneToDeliveryRange {
    return Object.assign(new DeliveryZoneToDeliveryRange(), data);
  }
}

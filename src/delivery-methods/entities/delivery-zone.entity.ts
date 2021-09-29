import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { DeliveryMethod } from "./delivery-method.entity";
import { Location } from "src/locations/entities/location.entity";
import { DeliveryZoneToShippingRange } from "./delivery-zone-to-shipping-range.entity";
import { DeliveryZoneToDeliveryRange } from "./delivery-zone-to-delivery-range.entity";

@Entity({
  name: 'delivery_zones',
})
export class DeliveryZone {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;

  @Column({
    name: 'extra_weight_price',
    type: 'decimal',
    precision: 19,
    scale: 4,
    default: 0,
  })
  extraPrice: number;

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

  @ManyToMany(() => Location, {cascade: ['insert', 'update'], onDelete: 'CASCADE'})
  @JoinTable({
    name: 'delivery_zone_to_location',
    joinColumn: {name: 'delivery_zone_id'},
    inverseJoinColumn: {name: 'location_id'},
  })
  locations: Location[];

  @OneToMany(() => DeliveryZoneToDeliveryRange, (dztsr) => dztsr.deliveryZone)
  deliveryZoneToDeliveryRanges: DeliveryZoneToDeliveryRange[];

  @OneToMany(() => DeliveryZoneToShippingRange, (dztsr) => dztsr.deliveryZone)
  deliveryZoneToShippingRanges: DeliveryZoneToShippingRange[];

  @CreateDateColumn({
    name: 'created_at',
    select: false,
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

  static create(data: Partial<DeliveryZone>): DeliveryZone {
    return Object.assign(new DeliveryZone(), data);
  }
}

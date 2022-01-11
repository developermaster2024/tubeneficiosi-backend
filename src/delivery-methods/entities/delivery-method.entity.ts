import { DeliveryMethodType } from "src/delivery-method-types/entities/delivery-method-type.entity";
import { DeliveryMethodTypes } from "src/delivery-method-types/enums/delivery-methods-types.enum";
import { Store } from "src/stores/entities/store.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { DeliveryRange } from "./delivery-range.entity";
import { DeliveryZone } from "./delivery-zone.entity";
import { ShippingRange } from "./shipping-range.entity";

@Entity({
  name: 'delivery_methods',
})
export class DeliveryMethod {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 150,
  })
  name: string;

  @Column({
    name: 'description',
    type: 'varchar'
  })
  description: string;

  @Column({
    name: 'img_path',
    type: 'varchar',
  })
  imgPath: string;

  @Column({
    name: 'store_id',
    type: 'int',
    select: false,
  })
  storeId: number;

  @ManyToOne(() => Store, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'store_id'})
  store: Store;

  @Column({
    name: 'delivery_method_type_code',
    type: 'varchar',
    length: 20,
    select: false,
  })
  deliveryMethodTypeCode: DeliveryMethodTypes;

  @ManyToOne(() => DeliveryMethodType, {nullable: false, onDelete: 'CASCADE', eager: true})
  @JoinColumn({name: 'delivery_method_type_code'})
  deliveryMethodType: DeliveryMethodType;

  @OneToMany(() => DeliveryZone, deliveryZone => deliveryZone.deliveryMethod, {cascade: ['insert', 'update']})
  deliveryZones: DeliveryZone[];

  @OneToMany(() => ShippingRange, shippingRange => shippingRange.deliveryMethod, {cascade: ['insert', 'update']})
  shippingRanges: ShippingRange[];

  @OneToMany(() => DeliveryRange, deliveryRange => deliveryRange.deliveryMethod, {cascade: ['insert', 'update']})
  deliveryRanges: DeliveryRange[];

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

  deliveryCost: number;

  static create(data: Partial<DeliveryMethod>): DeliveryMethod {
    return Object.assign(new DeliveryMethod(), data);
  }
}

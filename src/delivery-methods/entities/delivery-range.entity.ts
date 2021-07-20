import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DeliveryMethod } from "./delivery-method.entity";

@Entity({
  name: 'delivery_ranges',
})
export class DeliveryRange {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'min_products',
    type: 'int',
  })
  minProducts: number;

  @Column({
    name: 'max_products',
    type: 'int',
  })
  maxProducts: number;

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

  static create(data: Partial<DeliveryRange>): DeliveryRange {
    return Object.assign(new DeliveryRange(), data);
  }
}

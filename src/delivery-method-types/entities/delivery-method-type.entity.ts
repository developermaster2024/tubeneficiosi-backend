import { Column, Entity, PrimaryColumn } from "typeorm";
import { DeliveryMethodTypes } from "../enums/delivery-methods-types.enum";

@Entity({
  name: 'delivery_methods_types',
})
export class DeliveryMethodType {
  @PrimaryColumn({
    name: 'code',
    type: 'varchar',
    length: 20,
  })
  code: DeliveryMethodTypes;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 150,
  })
  name: string;

  static create(data: Partial<DeliveryMethodType>): DeliveryMethodType {
    return Object.assign(new DeliveryMethodType(), data);
  }
}

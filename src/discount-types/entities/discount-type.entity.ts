import { Column, Entity, PrimaryColumn } from "typeorm";
import { DiscountTypes } from "../enums/discount-types.enum";

@Entity({
  name: 'discount_types',
})
export class DiscountType {
  @PrimaryColumn({
    name: 'code',
    type: 'varchar',
    length: 20,
  })
  code: DiscountTypes;

  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;

  static create(data: Partial<DiscountType>): DiscountType {
    return Object.assign(new DiscountType(), data);
  }
}

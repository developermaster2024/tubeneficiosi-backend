import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartItem } from "./cart-item.entity";

@Entity({
  name: 'cart_item_features',
})
export class CartItemFeature {
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
    name: 'value',
    type: 'varchar',
  })
  value: string;

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 14,
    scale: 2,
  })
  price: number;

  @Column({
    name: 'cart_item_id',
    type: 'int',
  })
  cartItemId: number;

  @ManyToOne(() => CartItem, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_item_id' })
  cartItem: CartItem;

  static create(data: Partial<CartItemFeature>): CartItemFeature {
    return Object.assign(new CartItemFeature(), data);
  }
}

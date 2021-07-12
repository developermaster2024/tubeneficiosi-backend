import { Product } from "src/products/entities/product.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Cart } from "./cart.entity";

@Entity({
  name: 'cart_items',
})
export class CartItem {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'quantity',
    type: 'int',
  })
  quantity: number;

  @Column({
    name: 'cart_id',
    type: 'int',
  })
  cartId: number;

  @ManyToOne(() => Cart, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'cart_id'})
  cart: Cart;

  @Column({
    name: 'product_id',
    type: 'int',
  })
  productId: number;

  @ManyToOne(() => Product, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'product_id'})
  product: Product;

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

  get total(): number {
    return this.product.finalPrice * this.quantity;
  }

  static create(data: Partial<CartItem>): CartItem {
    return Object.assign(new CartItem(), data);
  }
}

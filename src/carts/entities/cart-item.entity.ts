import { Product } from "src/products/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartItemFeature } from "./cart-item-feature.entity";
import { CartItemShowDetails } from "./cart-item-show-details.entity";
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

  @Column({
    name: 'product_name',
    type: 'varchar',
  })
  productName: string;

  @Column({
    name: 'product_image',
    type: 'varchar',
  })
  productImage: string;

  @Column({
    name: 'product_price',
    type: 'decimal',
    precision: 14,
    scale: 2,
  })
  productPrice: number;

  @Column({
    name: 'product_slug',
    type: 'varchar',
  })
  productSlug: string;

  @OneToMany(() => CartItemFeature, cartItemFeature => cartItemFeature.cartItem, { cascade: ['insert', 'update'] })
  cartItemFeatures: CartItemFeature[];

  @OneToOne(() => CartItemShowDetails, cartItemShowDetails => cartItemShowDetails.cartItem, { cascade: ['insert', 'update'] })
  cartItemShowDetails: CartItemShowDetails;

  get total(): number {
    return (Number(this.productPrice) + this.featuresTotal) * this.quantity;
  }

  get featuresTotal(): number {
    return this.cartItemFeatures?.reduce((total, {price}) => total + Number(price), 0) ?? 0;
  }

  static create(data: Partial<CartItem>): CartItem {
    return Object.assign(new CartItem(), data);
  }
}

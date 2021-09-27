import { isAfter } from "date-fns";
import { Discount } from "src/discounts/entities/discount.entity";
import { Order } from "src/orders/entities/order.entity";
import { Store } from "src/stores/entities/store.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CartItem } from "./cart-item.entity";

@Entity({
  name: 'carts',
})
export class Cart {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'is_processed',
    type: 'boolean',
    default: 0,
  })
  isProcessed: boolean;

  @Column({
    name: 'is_direct_purchase',
    type: 'boolean',
    default: 0,
  })
  isDirectPurchase: boolean;

  @Column({
    name: 'user_id',
    type: 'int',
    select: false,
  })
  userId: number;

  @ManyToOne(() => User, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'user_id'})
  user: User;

  @Column({
    name: 'store_id',
    type: 'int',
  })
  storeId: number;

  @ManyToOne(() => Store, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'store_id'})
  store: Store;

  @OneToMany(() => CartItem, cartItem => cartItem.cart, {cascade: ['insert', 'update']})
  cartItems: CartItem[];

  @Column({
    name: 'expires_on',
    type: 'datetime',
  })
  expiresOn: Date;

  @OneToOne(() => Order, order => order.cart)
  order: Order;

  @Column({
    name: 'discount_id',
    type: 'int',
    nullable: true,
    select: false,
  })
  discountId: number;

  @Column({
    name: 'sub_total',
    type: 'decimal',
    precision: 14,
    scale: 2,
  })
  subTotal: number;

  @Column({
    name: 'sub_total_with_discount',
    type: 'decimal',
    precision: 14,
    scale: 2,
  })
  subTotalWithDiscount: number;

  @ManyToOne(() => Discount, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'discount_id' })
  discount: Discount;

  @CreateDateColumn({
    name: 'created_at',
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

  get computedSubTotal(): number {
    return this.cartItems
      .map(item => Number(item.total))
      .reduce(((total, currentValue) => total + currentValue), 0);
  }

  get computedSubTotalWithDiscount(): number {
    const subTotal = this.subTotal;

    const percentage = Number(this?.discount?.value) || 0;

    const discountAmount = subTotal * percentage / 100;

    return subTotal - discountAmount;
  }

  get isExpired(): boolean {
    return isAfter(new Date, this.expiresOn);
  }

  static create(data: Partial<Cart>): Cart {
    return Object.assign(new Cart(), data);
  }
}

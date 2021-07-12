import { Store } from "src/stores/entities/store.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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
    // select: false,
  })
  storeId: number;

  @ManyToOne(() => Store, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'store_id'})
  store: Store;

  @OneToMany(() => CartItem, cartItem => cartItem.cart, {cascade: ['insert', 'update']})
  cartItems: CartItem[];

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

  get subTotal(): number {
    return this.cartItems
        .map(item => Number(item.total))
        .reduce(((total, currentValue) => total + currentValue), 0);
  }

  static create(data: Partial<Cart>): Cart {
    return Object.assign(new Cart(), data);
  }
}

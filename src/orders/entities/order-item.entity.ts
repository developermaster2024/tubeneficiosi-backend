import { Product } from "src/products/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity({
  name: 'order_items',
})
export class OrderItem {
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
    name: 'product_id',
    type: 'int',
    select: false,
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

  @ManyToOne(() => Order, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'order_id'})
  order: Order;

  get total(): number {
    return this.quantity * this.productPrice;
  }

  static create(data: Partial<OrderItem>): OrderItem {
    return Object.assign(new OrderItem(), data);
  }
}

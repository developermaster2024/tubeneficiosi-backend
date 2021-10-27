import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity({
  name: 'product_dimensions',
})
export class ProductDimension {
  @OneToOne(() => Product, product => product.productDimensions, {primary: true, onDelete: 'CASCADE'})
  @JoinColumn({name: 'product_id'})
  product: Product;

  @Column({
    name: 'width',
    type: 'decimal',
    precision: 12,
    scale: 4,
  })
  width: number;

  @Column({
    name: 'height',
    type: 'decimal',
    precision: 12,
    scale: 4,
  })
  height: number;

  @Column({
    name: 'length',
    type: 'decimal',
    precision: 12,
    scale: 4,
  })
  length: number;

  @Column({
    name: 'weight',
    type: 'decimal',
    precision: 12,
    scale: 4,
  })
  weight: number;

  static create(data: Partial<ProductDimension>): ProductDimension {
    return Object.assign(new ProductDimension(), data);
  }
}

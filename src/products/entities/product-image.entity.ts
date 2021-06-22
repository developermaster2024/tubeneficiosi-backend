import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity({
  name: 'product_images',
})
export class ProductImage {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'path',
    type: 'varchar',
  })
  path: string;

  @ManyToOne(() => Product, product => product.productImages, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'product_id'})
  product: Product;

  static create(data: Partial<ProductImage>): ProductImage {
    return Object.assign(new ProductImage(), data);
  }
}

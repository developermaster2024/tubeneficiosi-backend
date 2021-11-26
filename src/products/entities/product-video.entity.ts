import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity({
  name: 'product_videos',
})
export class ProductVideo {
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
    name: 'url',
    type: 'varchar',
  })
  url: string;

  @Column({
    name: 'product_id',
    type: 'int',
    select: false,
  })
  productId: number;

  @ManyToOne(() => Product, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'product_id'})
  product: Product;

  static create(data: Partial<ProductVideo>): ProductVideo {
    return Object.assign(new ProductVideo(), data);
  }
}

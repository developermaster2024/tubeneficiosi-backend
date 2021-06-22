import { ProductFeature } from "src/product-features/entities/product-feature.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity({
  name: 'product_to_product_feature',
})
export class ProductToProductFeature {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 14,
    scale: 2
  })
  price: number;

  @ManyToOne(() => ProductFeature, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'product_feature_id'})
  productFeature: ProductFeature;

  @ManyToOne(() => Product, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'product_id'})
  product: Product;

  static create(data: Partial<ProductToProductFeature>): ProductToProductFeature {
    return Object.assign(new ProductToProductFeature(), data);
  }
}

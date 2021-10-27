import { Brand } from "src/brands/entities/brand.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { Product } from "./product.entity";

@Entity({
  name: 'product_details',
})
export class ProductDetails {
  @OneToOne(() => Product, product => product.productDetails, {primary: true, onDelete: 'CASCADE'})
  @JoinColumn({name: 'product_id'})
  product: Product;

  @Column({
    name: 'reference',
    type: 'varchar',
    nullable: true,
  })
  reference: string;

  @Column({
    name: 'short_description',
    type: 'varchar',
    nullable: true,
  })
  shortDescription: string;

  @Column({
    name: 'quantity',
    type: 'int',
    default: 0,
  })
  quantity: number;

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 14,
    scale: 2,
  })
  price: number;

  @Column({
    name: 'brand_id',
    type: 'int',
    nullable: true,
  })
  brandId: number;

  @ManyToOne(() => Brand, {nullable: true})
  @JoinColumn({name: 'brand_id'})
  brand: Brand;

  get finalPrice(): number {
    return this.price;
  }

  static create(data: Partial<ProductDetails>): ProductDetails {
    return Object.assign(new ProductDetails(), data);
  }
}

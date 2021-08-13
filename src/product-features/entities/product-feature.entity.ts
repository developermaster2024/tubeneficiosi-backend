import { Product } from "src/products/entities/product.entity";
import { Store } from "src/stores/entities/store.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'product_features',
})
export class ProductFeature {
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
    name: 'value',
    type: 'varchar',
  })
  value: string;

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 14,
    scale: 2
  })
  price: number;

  @Column({
    name: 'is_selectable',
    type: 'boolean',
  })
  isSelectable: boolean;

  @Column({
    name: 'product_id',
    type: 'int',
    select: false,
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

  @DeleteDateColumn({
    name: 'deleted_at',
    select: false
  })
  deletedAt: Date;

  static create(data: Partial<ProductFeature>): ProductFeature {
    return Object.assign(new ProductFeature(), data);
  }
}

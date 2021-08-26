import { Product } from "src/products/entities/product.entity";
import { StoreCategory } from "src/store-categories/entities/store-category.entity";
import isAdActive from "src/support/is-ad-active";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'featured_ads',
})
export class FeaturedAd {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'priority',
    type: 'int',
  })
  priority: number;

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 14,
    scale: 2,
  })
  price: number;

  @Column({
    name: 'from',
    type: 'datetime',
  })
  from: Date;

  @Column({
    name: 'until',
    type: 'datetime',
  })
  until: Date;

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
    name: 'store_category_id',
    type: 'int',
    select: false
  })
  storeCategoryId: number;

  @ManyToOne(() => StoreCategory, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'store_category_id'})
  storeCategory: StoreCategory;

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

  get isActive(): boolean {
    return isAdActive(this.from, this.until);
  }

  static create(data: Partial<FeaturedAd>): FeaturedAd {
    return Object.assign(new FeaturedAd(), data);
  }
}

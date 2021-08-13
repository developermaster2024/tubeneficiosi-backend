import { Brand } from "src/brands/entities/brand.entity";
import { Category } from "src/categories/entities/category.entity";
import { DeliveryMethodType } from "src/delivery-method-types/entities/delivery-method-type.entity";
import { ProductFeature } from "src/product-features/entities/product-feature.entity";
import { Store } from "src/stores/entities/store.entity";
import { Tag } from "src/tags/entities/tag.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProductDimension } from "./product-dimension.entity";
import { ProductFeatureGroup } from "./product-feature-group.entity";
import { ProductImage } from "./product-image.entity";

@Entity({
  name: 'products'
})
export class Product {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;

  @Index({unique: true})
  @Column({
    name: 'slug',
    type: 'varchar',
  })
  slug: string;

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
    name: 'description',
    type: 'text',
    nullable: true,
  })
  description: string;

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

  @Column({
    name: 'store_id',
    type: 'int',
    select: false,
  })
  storeId: number;

  @ManyToOne(() => Store, {nullable: false})
  @JoinColumn({name: 'store_id'})
  store: Store;

  @ManyToMany(() => DeliveryMethodType, {cascade: true, onDelete: 'CASCADE'})
  @JoinTable({
    name: 'product_to_delivery_method_type',
    joinColumn: {name: 'product_id'},
    inverseJoinColumn: {name: 'delivery_method_type_id'},
  })
  deliveryMethodTypes: DeliveryMethodType[];

  @ManyToMany(() => Tag, {
    cascade: ['insert', 'update'],
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'product_to_tag',
    joinColumn: {name: 'product_id'},
    inverseJoinColumn: {name: 'tag_id'},
  })
  tags: Tag[];

  @ManyToMany(() => Category, {
    cascade: ['insert', 'update'],
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'product_to_category',
    joinColumn: {name: 'product_id'},
    inverseJoinColumn: {name: 'category_id'},
  })
  categories: Category[];

  @OneToMany(() => ProductFeature, productFeature => productFeature.product, {cascade: ['insert', 'update']})
  productFeatures: ProductFeature[];

  @OneToMany(() => ProductImage, productImage => productImage.product, {cascade: ['insert', 'update']})
  productImages: ProductImage[];

  @OneToMany(() => ProductFeatureGroup, productFeatureGroup => productFeatureGroup.product, {cascade: ['insert', 'update']})
  productFeatureGroups: ProductFeatureGroup[];

  @OneToOne(() => ProductDimension, productDimension => productDimension.product, {cascade: ['insert', 'update']})
  productDimensions: ProductDimension;

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

  get finalPrice(): number {
    return this.price;
  }

  static create(data: Partial<Product>): Product {
    return Object.assign(new Product(), data);
  }
}

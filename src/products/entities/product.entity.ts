import { Category } from "src/categories/entities/category.entity";
import { DeliveryMethodType } from "src/delivery-method-types/entities/delivery-method-type.entity";
import { FavoriteProduct } from "src/favorite-products/entities/favorite-product.entity";
import { ProductFeature } from "src/product-features/entities/product-feature.entity";
import { ShowDetails } from "src/shows/entities/show-details.entity";
import { Show } from "src/shows/entities/show.entity";
import { Store } from "src/stores/entities/store.entity";
import { Tag } from "src/tags/entities/tag.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProductDetails } from "./product-details.entity";
import { ProductDimension } from "./product-dimension.entity";
import { ProductFeatureGroup } from "./product-feature-group.entity";
import { ProductImage } from "./product-image.entity";
import { ProductVideo } from "./product-video.entity";

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
    name: 'description',
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    name: 'store_id',
    type: 'int',
    select: false,
  })
  storeId: number;

  @ManyToOne(() => Store, {nullable: false})
  @JoinColumn({name: 'store_id'})
  store: Store;

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

  @OneToMany(() => ProductImage, productImage => productImage.product, {cascade: ['insert', 'update']})
  productImages: ProductImage[];

  @OneToMany(() => ProductVideo, productVideo => productVideo.product, {cascade: ['insert', 'update']})
  productVideos: ProductVideo[];

  @OneToMany(() => FavoriteProduct, (favoriteProduct) => favoriteProduct.product)
  favoriteProducts: FavoriteProduct[];

  favoriteProduct: FavoriteProduct;

  @OneToOne(() => ProductDetails, productDetails => productDetails.product, { cascade: ['insert', 'update'] })
  productDetails: ProductDetails;

  @OneToOne(() => ShowDetails, showDetails => showDetails.product, { cascade: ['insert', 'update'] })
  showDetails: ShowDetails;

  @OneToMany(() => ProductFeature, productFeature => productFeature.product, {cascade: ['insert', 'update']})
  productFeatures: ProductFeature[];

  @OneToMany(() => ProductFeatureGroup, productFeatureGroup => productFeatureGroup.product, {cascade: ['insert', 'update']})
  productFeatureGroups: ProductFeatureGroup[];

  @OneToOne(() => ProductDimension, productDimension => productDimension.product, {cascade: ['insert', 'update']})
  productDimensions: ProductDimension;

  @ManyToMany(() => DeliveryMethodType, {cascade: true, onDelete: 'CASCADE'})
  @JoinTable({
    name: 'product_to_delivery_method_type',
    joinColumn: {name: 'product_id'},
    inverseJoinColumn: {name: 'delivery_method_type_id'},
  })
  deliveryMethodTypes: DeliveryMethodType[];

  @OneToMany(() => Show, show => show.product)
  shows: Show[];

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

  get isFavorite(): boolean {
    return !!this.favoriteProduct;
  }

  @Column({
    name: 'rating',
    type: 'int',
    default: 0,
  })
  rating: number;

  static create(data: Partial<Product>): Product {
    return Object.assign(new Product(), data);
  }
}

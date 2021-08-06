import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductFeatureForGroup } from "./product-feature-for-group.entity";
import { Product } from "./product.entity";

@Entity({
  name: 'product_feature_groups',
})
export class ProductFeatureGroup {
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
    name: 'is_multi_selectable',
    type: 'boolean',
  })
  isMultiSelectable: boolean;

  @Column({
    name: 'product_id',
    type: 'int',
    select: false,
  })
  productId: number;

  @ManyToOne(() => Product, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'product_id'})
  product: Product;

  @OneToMany(() => ProductFeatureForGroup, productFeatureForGroup => productFeatureForGroup.productFeatureGroup, {cascade: ['insert', 'update']})
  productFeatureForGroups: ProductFeatureForGroup[];

  static create(data: Partial<ProductFeatureGroup>): ProductFeatureGroup {
    return Object.assign(new ProductFeatureGroup(), data);
  }
}

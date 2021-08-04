import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductFeatureGroup } from "./product-feature-group.entity";

@Entity({
  name: 'product_feature_for_groups'
})
export class ProductFeatureForGroup {
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

  @ManyToOne(() => ProductFeatureGroup, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'product_feature_group_id'})
  productFeatureGroup: ProductFeatureGroup;

  static create(data: Partial<ProductFeatureForGroup>): ProductFeatureForGroup {
    return Object.assign(new ProductFeatureForGroup(), data);
  }
}

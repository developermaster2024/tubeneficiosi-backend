import { StoreCategory } from "src/store-categories/entities/store-category.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'store_features',
})
export class StoreFeature {
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
    name: 'store_category_id',
    type: 'int',
    select: false,
  })
  storeCategoryId: number;

  @ManyToOne(() => StoreCategory, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_category_id' })
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

  static create(data: Partial<StoreFeature>): StoreFeature {
    return Object.assign(new StoreFeature(), data);
  }
}

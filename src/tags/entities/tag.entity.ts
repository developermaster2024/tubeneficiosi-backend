import { StoreCategory } from "src/store-categories/entities/store-category.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'tags'
})
export class Tag {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;

  @ManyToMany(() => Tag, {
    cascade: ['insert', 'update']
  })
  @JoinTable({
    joinColumn: {name: 'parent_tag_id'},
    inverseJoinColumn: {name: 'child_tag_id'},
    name: 'tag_tag',
  })
  parentTags: Tag[];

  @Column({
    name: 'store_category_id',
    type: 'int',
    select: false,
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

  static create(data: Partial<Tag>): Tag {
    return Object.assign(new Tag(), data);
  }
}

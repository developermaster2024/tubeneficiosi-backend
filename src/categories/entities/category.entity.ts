import { Store } from "src/stores/entities/store.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'categories',
})
export class Category {
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
    name: 'parent_id',
    type: 'int',
    nullable: true,
    select: false,
  })
  parentId: number;

  @ManyToOne(() => Category, {nullable: true, onDelete: 'CASCADE'})
  @JoinColumn({name: 'parent_id'})
  parentCategory: Category;

  @ManyToOne(() => Store, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'store_id'})
  store: Store;

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

  static create(data: Partial<Category>): Category {
    return Object.assign(new Category(), data);
  }
}

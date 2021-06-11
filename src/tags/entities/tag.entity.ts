import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

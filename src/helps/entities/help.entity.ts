import { HelpCategory } from "src/help-categories/entities/help-category.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'helps',
})
export class Help {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'title',
    type: 'varchar',
  })
  title: string;

  @Column({
    name: 'description',
    type: 'text',
  })
  description: string;

  @Column({
    name: 'help_category_id',
    type: 'int'
  })
  helpCategoryId: number;

  @ManyToOne(() => HelpCategory, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({name: 'help_category_id'})
  helpCategory: HelpCategory;

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

  static create(data: Partial<Help>): Help {
    return Object.assign(new Help(), data);
  }
}

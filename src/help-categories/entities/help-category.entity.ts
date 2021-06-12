import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'help_categories',
})
export class HelpCategory {
  @PrimaryGeneratedColumn({
    name: 'id'
  })
  readonly id: number;

  @Column({
    name: 'name',
    type: 'varchar'
  })
  name: string;

  @Column({
    name: 'icon',
    type: 'varchar'
  })
  icon: string;

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

  static create(data: Partial<HelpCategory>): HelpCategory {
    return Object.assign(new HelpCategory(), data);
  }
}

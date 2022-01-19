import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'store_categories'
})
export class StoreCategory {
  @PrimaryGeneratedColumn({
    name: 'id'
  })
  readonly id: number;

  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;

  @Column({
    name: 'img_path',
    type: 'varchar',
  })
  imgPath: string;

  @Column({
    name: 'logo',
    type: 'varchar',
  })
  logo: string;

  @Column({
    name: 'map_icon',
    type: 'varchar',
  })
  mapIcon: string;

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
}

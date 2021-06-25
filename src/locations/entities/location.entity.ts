import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'locations',
})
export class Location {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'name',
    type: 'varchar'
  })
  name: string;

  @Index({spatial: true})
  @Column({
    name: 'area',
    type: 'multipolygon',
    spatialFeatureType: 'Multipolygon',
    // select: false,
  })
  area: string;

  @Column({
    name: 'parent_id',
    type: 'int',
    nullable: true,
    select: false,
  })
  parentId: number;

  @ManyToOne(() => Location, {nullable: true, onDelete: 'CASCADE'})
  @JoinColumn({name: 'parent_id'})
  parentLocation: Location;

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

  static create(data: Partial<Location>): Location {
    return Object.assign(new Location(), data);
  }
}

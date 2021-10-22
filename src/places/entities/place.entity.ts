import { Store } from "src/stores/entities/store.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Zone } from "./zone.entity";

@Entity({
  name: 'places',
})
export class Place {
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
    name: 'img_path',
    type: 'varchar',
  })
  imgPath: string;

  @Column({
    name: 'store_id',
    type: 'int',
    select: false,
  })
  storeId: number;

  @ManyToOne(() => Store, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @OneToMany(() => Zone, (zone) => zone.place, { cascade: ['insert', 'update'] })
  zones: Zone[];

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

  get capacity(): number {
    return !this.zones ? 0 : this.zones.reduce((total, zone) => total + zone.capacity, 0);
  }

  static create(data: Partial<Place>): Place {
    return Object.assign(new Place(), data);
  }
}

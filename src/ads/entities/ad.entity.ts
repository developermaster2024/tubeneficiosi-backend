import { AdsPosition } from "src/ads-positions/entities/ads-position.entity";
import { Store } from "src/stores/entities/store.entity";
import isAdActive from "src/support/is-ad-active";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'ads',
})
export class Ad {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'image_path',
    type: 'varchar',
  })
  imagePath: string;

  get imgPath(): string {
    return this.imagePath;
  }

  @Column({
    name: 'title',
    type: 'varchar',
  })
  title: string;

  @Column({
    name: 'description',
    type: 'varchar',
  })
  description: string;

  @Column({
    name: 'url',
    type: 'varchar',
  })
  url: string;

  @Column({
    name: 'priority',
    type: 'int'
  })
  priority: number;

  @Column({
    name: 'from',
    type: 'datetime',
  })
  from: Date;

  @Column({
    name: 'until',
    type: 'datetime',
  })
  until: Date;

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 14,
    scale: 2
  })
  price: number;

  @Column({
    name: 'percentage',
    type: 'int',
    default: 0,
  })
  percentage: number;

  @Column({
    name: 'store_id',
    type: 'int',
    select: false,
  })
  storeId: number;

  @ManyToOne(() => Store, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'store_id'})
  store: Store;

  @Column({
    name: 'ads_position_id',
    type: 'int',
    select: false,
  })
  adsPositionId: number;

  @ManyToOne(() => AdsPosition, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({name: 'ads_position_id'})
  adsPosition: AdsPosition;

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

  get isActive(): boolean {
    return isAdActive(this.from, this.until);
  }

  static create(data: Partial<Ad>): Ad {
    return Object.assign(new Ad(), data);
  }
}

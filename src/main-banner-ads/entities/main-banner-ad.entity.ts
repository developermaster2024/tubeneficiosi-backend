import { Store } from "src/stores/entities/store.entity";
import isAdActive from "src/support/is-ad-active";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'main_banner_ads',
})
export class MainBannerAd {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'img_path',
    type: 'varchar',
  })
  imgPath: string;

  @Column({
    name: 'url',
    type: 'varchar',
  })
  url: string;

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
    name: 'priority',
    type: 'int'
  })
  priority: number;

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 14,
    scale: 2,
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

  @ManyToOne(() => Store, {nullable: false, eager: true})
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

  get isActive(): boolean {
    return isAdActive(this.from, this.until);
  }

  static create(data: Partial<MainBannerAd>): MainBannerAd {
    return Object.assign(new MainBannerAd(), data);
  }
}

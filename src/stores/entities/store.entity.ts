import { Product } from "src/products/entities/product.entity";
import { StoreCategory } from "src/store-categories/entities/store-category.entity";
import { StoreHour } from "src/store-hours/entities/store-hour.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { StoreProfile } from "./store-profile.entity";

@Entity({
  name: 'stores',
})
export class Store {
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
    name: 'phone_number',
    type: 'varchar',
    length: 50,
  })
  phoneNumber: string;

  @Column({
    name: 'address',
    type: 'varchar',
  })
  address: string;

  @Index({spatial: true})
  @Column({
    name: 'location',
    type: 'point',
    spatialFeatureType: 'Point',
    select: false,
  })
  location: string;

  @Column({
    name: 'latitude',
    type: 'decimal',
    scale: 6,
    precision: 10,
  })
  latitude: number;

  @Column({
    name: 'longitude',
    type: 'decimal',
    precision: 10,
    scale: 6,
  })
  longitude: number;

  @Column({
    name: 'user_id',
    type: 'int',
    select: false,
  })
  userId: number;

  @OneToOne(() => User, {nullable: true, onDelete: 'CASCADE'})
  @JoinColumn({name: 'user_id'})
  user: User;

  @Column({
    name: 'store_category_id',
    type: 'int',
  })
  storeCategoryId: number;

  @ManyToOne(() => StoreCategory)
  @JoinColumn({name: 'store_category_id'})
  storeCategory: StoreCategory;

  @OneToOne(() => StoreProfile, storeProfile => storeProfile.store, {
    eager: true,
    cascade: ['insert', 'update'],
    onDelete: 'CASCADE',
  })
  storeProfile: StoreProfile;

  @OneToMany(() => Product, product => product.store)
  products: Product[];

  @OneToMany(() => StoreHour, storeHour => storeHour.store, {cascade: ['insert', 'update']})
  storeHours: StoreHour[];

  static create(data: Partial<Store>): Store {
    return Object.assign(new Store, data);
  }
}

import { Place } from "src/places/entities/place.entity";
import { Product } from "src/products/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ShowToZone } from "./show-to-zone.entity";

@Entity({
  name: 'shows',
})
export class Show {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'date',
    type: 'datetime',
  })
  date: Date;

  @Column({
    name: 'place_id',
    type: 'int',
    select: false,
  })
  placeId: number;

  @ManyToOne(() => Place, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'place_id' })
  place: Place;

  @Column({
    name: 'product_id',
    type: 'int',
    select: false,
  })
  productId: number;

  @ManyToOne(() => Product, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToMany(() => ShowToZone, showToZone => showToZone.show, { cascade: ['insert', 'update'] })
  showToZones: ShowToZone[];

  static create(data: Partial<Show>): Show {
    return Object.assign(new Show(), data);
  }
}

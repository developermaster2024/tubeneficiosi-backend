import { Zone } from "src/places/entities/zone.entity";
import { ShowToZone } from "src/shows/entities/show-to-zone.entity";
import { Show } from "src/shows/entities/show.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartItem } from "./cart-item.entity";

@Entity({
  name: 'cart_item_show_details',
})
export class CartItemShowDetails {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'cart_item_id',
    type: 'int',
    select: false,
  })
  cartItemId: number;

  @OneToOne(() => CartItem, cartItem => cartItem.cartItemShowDetails, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_item_id' })
  cartItem: CartItem;

  @Column({
    name: 'show_id',
    type: 'int',
    select: false,
  })
  showId: number;

  @ManyToOne(() => Show, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'show_id' })
  show: Show;

  @Column({
    name: 'zone_id',
    type: 'int',
    select: false,
  })
  zoneId: number;

  @ManyToOne(() => Zone, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'zone_id' })
  zone: Zone;

  @Column({
    name: 'show_to_zone_id',
    type: 'int',
    select: false,
  })
  showToZoneId: number;

  @ManyToOne(() => ShowToZone, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'show_to_zone_id' })
  showToZone: ShowToZone;

  static create(data: Partial<CartItemShowDetails>): CartItemShowDetails {
    return Object.assign(new CartItemShowDetails(), data);
  }
}

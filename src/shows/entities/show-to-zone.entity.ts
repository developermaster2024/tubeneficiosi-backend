import { Zone } from "src/places/entities/zone.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Show } from "./show.entity";

@Entity({
  name: 'show_to_zone',
})
export class ShowToZone {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 14,
    scale: 2
  })
  price: number;

  @Column({
    name: 'available_seats',
    type: 'int',
  })
  availableSeats: number;

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
  })
  zoneId: number;

  @ManyToOne(() => Zone, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'zone_id' })
  zone: Zone;

  static create(data: Partial<ShowToZone>): ShowToZone {
    return Object.assign(new ShowToZone(), data);
  }
}

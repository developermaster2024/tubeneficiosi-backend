import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Place } from "./place.entity";

@Entity({
  name: 'zones',
})
export class Zone {
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
    name: 'capacity',
    type: 'int',
  })
  capacity: number;

  @Column({
    name: 'place_id',
    type: 'int',
    select: false,
  })
  placeId: number;

  @ManyToOne(() => Place, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'place_id' })
  place: Place;

  static create(data: Partial<Zone>): Zone {
    return Object.assign(new Zone(), data);
  }
}

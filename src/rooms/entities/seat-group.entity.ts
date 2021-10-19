import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./room.entity";

@Entity({
  name: 'seat_groups',
})
export class SeatGroup {
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
    name: 'room_id',
    type: 'int',
    select: false,
  })
  roomId: number;

  @ManyToOne(() => Room, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' })
  room: Room;

  static create(data: Partial<SeatGroup>): SeatGroup {
    return Object.assign(new SeatGroup(), data);
  }
}

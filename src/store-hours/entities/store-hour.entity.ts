import { Store } from "src/stores/entities/store.entity";
import { Days } from "src/support/types/days.enum";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'store_hours',
})
export class StoreHour {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'is_working_day',
    type: 'boolean',
  })
  isWorkingDay: boolean;

  @Column({
    name: 'day',
    type: 'varchar',
  })
  day: Days;

  @Column({
    name: 'start_time',
    type: 'time',
  })
  startTime: Date;

  @Column({
    name: 'end_time',
    type: 'time',
  })
  endTime: Date;

  @Column({
    name: 'store_id',
    type: 'int',
    select: false,
  })
  storeId: number;

  @ManyToOne(() => Store, {nullable: false, onDelete: 'CASCADE'})
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

  static create(data: Partial<StoreHour>): StoreHour {
    return Object.assign(new StoreHour(), data);
  }
}

import { format, parse } from "date-fns";
import { Store } from "src/stores/entities/store.entity";
import isAdActive from "src/support/is-ad-active";
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

  get isActive(): boolean {
    const dayOfTheWeek = format(new Date(), 'iiii').toUpperCase();

    const now = new Date();
    const fullDateStartTime = parse(this.startTime.toString(), 'HH:mm:ss', now);
    const fullDateEndTime = parse(this.endTime.toString(), 'HH:mm:ss', now);

    return (
      this.isWorkingDay &&
      dayOfTheWeek === this.day &&
      isAdActive(fullDateStartTime, fullDateEndTime, now)
    );
  }

  get dayInSpanish(): string {
    switch(this.day) {
      case Days.MONDAY:
        return 'Lunes';
      case Days.TUESDAY:
        return 'Martes';
      case Days.WEDNESDAY:
        return 'Miércoles';
      case Days.THURSDAY:
        return 'Jueves';
      case Days.FRIDAY:
        return 'Viernes';
      case Days.SATURDAY:
        return 'Sábado';
      case Days.SUNDAY:
        return 'Domingo';
      default:
        return 'unkown';
    }
  }

  static create(data: Partial<StoreHour>): StoreHour {
    return Object.assign(new StoreHour(), data);
  }
}

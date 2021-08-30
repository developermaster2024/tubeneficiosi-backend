import { Role } from "src/users/enums/roles.enum";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { NotificationTypes } from "../enums/notification-types.enum";
import { UserToNotification } from "./user-to-notification.entity";

@Entity({
  name: 'notifications',
})
export class Notification {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'message',
    type: 'varchar'
  })
  message: string;

  @Column({
    name: 'date',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date;

  @Column({
    name: 'role',
    type: 'varchar',
    length: 50,
  })
  role: Role;

  @Column({
    name: 'type',
    type: 'varchar',
    length: 50,
  })
  type: NotificationTypes;

  @Column({
    name: 'additional_data',
    type: 'json',
    nullable: true,
  })
  additionalData: Object;

  @OneToMany(() => UserToNotification, userToNotification => userToNotification.notification)
  userToNotifications: UserToNotification[];

  @CreateDateColumn({
    name: 'created_at',
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

  static create(data: Partial<Notification>): Notification {
    return Object.assign(new Notification(), data);
  }
}

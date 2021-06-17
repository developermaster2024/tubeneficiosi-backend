import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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

  @OneToMany(() => UserToNotification, userToNotification => userToNotification.notification)
  userToNotifications: UserToNotification[];

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

  static create(data: Partial<Notification>): Notification {
    return Object.assign(new Notification(), data);
  }
}
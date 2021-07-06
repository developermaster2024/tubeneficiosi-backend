import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Notification } from "./notification.entity";

@Entity({
  name: 'user_to_notification',
})
export class UserToNotification {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  readonly id: number;

  @Column({
    name: 'seen',
    type: 'boolean',
    default: false,
  })
  seen: boolean;

  @Column({
    name: 'user_id',
    type: 'int',
  })
  userId: number;

  @ManyToOne(() => User, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'user_id'})
  user: User;

  @Column({
    name: 'notification_id',
    type: 'int',
    select: false,
  })
  notificationId: number;

  @ManyToOne(() => Notification, notification => notification.userToNotifications, {
    cascade: ['insert', 'update'],
    onDelete: 'CASCADE'
  })
  @JoinColumn({name: 'notification_id'})
  notification: Notification;

  static create(data: Partial<UserToNotification>): UserToNotification {
    return Object.assign(new UserToNotification(), data);
  }
}

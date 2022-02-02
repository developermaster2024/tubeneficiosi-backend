import { plainToClass } from "class-transformer";
import { formatDistance } from "date-fns";
import { es } from "date-fns/locale";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ReadNotificationDto } from "../dto/read-notification.dto";
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

  @OneToMany(() => UserToNotification, userToNotification => userToNotification.notification, { cascade: ['insert', 'update'] })
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

  userToNotification: UserToNotification;

  get distanceInWords(): string {
    return formatDistance(this.createdAt, new Date(), { addSuffix: true, locale: es });
  }

  get title(): string {
    switch(this.type) {
      case NotificationTypes.ORDER_CREATED:
        return '¡Orden creada!';
      case NotificationTypes.ORDER_STATUS_CHANGE:
        return '¡Estatus de orden actualizado!';
      case NotificationTypes.REGISTERED_CUSTOMER:
        return 'Nuevo cliente registrado';
      case NotificationTypes.REGISTERED_STORE:
          return 'Nueva tienda registrada';
      case NotificationTypes.NEW_DISCOUNT:
          return '¡Nuevo descuento!';
      default:
        return 'Beneficio Si';
    }
  }

  toDto(): ReadNotificationDto {
    return plainToClass(ReadNotificationDto, this);
  }

  static create(data: Partial<Notification>): Notification {
    return Object.assign(new Notification(), data);
  }
}

import { Exclude, Expose, Transform } from "class-transformer";
import { format } from "date-fns";
import { UserToNotification } from "../entities/user-to-notification.entity";
import { NotificationTypes } from "../enums/notification-types.enum";

@Exclude()
export class ReadNotificationDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly message: string;

  @Expose()
  readonly userToNotification: UserToNotification;

  @Expose()
  readonly type: NotificationTypes;

  @Expose()
  readonly additionalData: Object;

  @Expose()
  @Transform(({value}) => format(value, 'yyyy-MM-dd HH:mm:ss'))
  readonly createdAt: Date;

  @Expose()
  readonly distanceInWords: string;

  @Expose()
  readonly title: string;
}

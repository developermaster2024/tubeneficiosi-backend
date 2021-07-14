import { Exclude, Expose, Transform } from "class-transformer";
import { format } from "date-fns";
import { User } from "src/users/entities/user.entity";
import { Role } from "src/users/enums/roles.enum";

@Exclude()
export class ReadNotificationDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly message: string;

  @Expose()
  readonly seen: boolean;

  @Expose()
  readonly role: Role;

  @Expose()
  readonly recipient: User;

  @Expose()
  readonly sender: User;

  @Expose()
  @Transform(({value}) => format(value, 'yyyy-MM-dd HH:mm:ss'))
  readonly createdAt: Date;
}

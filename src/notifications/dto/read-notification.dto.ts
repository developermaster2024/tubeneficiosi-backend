import { Exclude, Expose } from "class-transformer";
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
}

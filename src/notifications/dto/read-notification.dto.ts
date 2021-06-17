import { Exclude, Expose } from "class-transformer";
import { User } from "src/users/entities/user.entity";

@Exclude()
export class ReadNotificationDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly message: string;

  @Expose()
  readonly seen: boolean;

  @Expose()
  readonly recipient: User;

  @Expose()
  readonly sender: User;
}

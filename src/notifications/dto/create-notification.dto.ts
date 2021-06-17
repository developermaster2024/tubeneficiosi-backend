import { Exclude, Expose } from "class-transformer";
import { IsIn, MaxLength } from "class-validator";
import { Role } from "src/users/enums/roles.enum";

@Exclude()
export class CreateNotificationDto {
  @Expose()
  @MaxLength(255)
  readonly message: string;

  @Expose()
  @IsIn([Role.CLIENT, Role.ADMIN, Role.STORE])
  readonly role: string;
}

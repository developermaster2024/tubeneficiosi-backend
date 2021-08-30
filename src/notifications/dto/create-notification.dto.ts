import { Exclude, Expose } from "class-transformer";
import { IsIn, IsJSON, MaxLength, ValidateIf } from "class-validator";
import { Role } from "src/users/enums/roles.enum";
import { NotificationTypes, NotificationTypesValues } from "../enums/notification-types.enum";

@Exclude()
export class CreateNotificationDto {
  @Expose()
  @MaxLength(255)
  readonly message: string;

  @Expose()
  @IsIn([Role.CLIENT, Role.ADMIN, Role.STORE])
  readonly role: Role;

  @Expose()
  @IsIn(NotificationTypesValues)
  readonly type: NotificationTypes;

  @Expose()
  @ValidateIf(({value}) => value)
  @IsJSON()
  readonly additionalData: Object;
}

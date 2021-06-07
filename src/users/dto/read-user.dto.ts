import { Exclude, Expose } from "class-transformer";
import { Roles } from "../enums/roles.enum";

@Exclude()
export class ReadUserDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly email: string;

  @Expose()
  readonly isActive: boolean;

  @Expose()
  readonly role: Roles;
}

import { Exclude, Expose } from "class-transformer";
import { User } from "src/users/entities/user.entity";
import { Role } from "src/users/enums/roles.enum";
import { Exists } from "src/validation/exists.constrain";

@Exclude()
export class ForgotClientPasswordDto {
  @Expose()
  @Exists(User, 'email', (value) => ({
    where: { email: value, role: Role.CLIENT }
  }))
  readonly email: string;
}

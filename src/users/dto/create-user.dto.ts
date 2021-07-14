import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";
import { Exists } from "src/validation/exists.constrain";
import { IsUnique } from "src/validation/is-unique.constrain";
import { UserStatus } from "../entities/user-status.entity";
import { User } from "../entities/user.entity";
import { UserStatuses } from "../enums/user-statuses.enum";

@Exclude()
export class CreateUserDto {
  @Expose()
  @IsString()
  @MaxLength(250)
  @MinLength(2)
  readonly name: string;

  @Expose()
  @IsEmail()
  @MaxLength(150)
  @IsUnique(User)
  readonly email: string;

  @Expose()
  @IsString()
  @MinLength(8)
  readonly password: string;

  @Expose()
  @Exists(UserStatus, 'code')
  readonly userStatusCode: UserStatuses;
}

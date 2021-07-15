import { Exclude, Expose, Transform } from "class-transformer";
import { IsEmail, IsPhoneNumber, IsString, MaxLength, MinLength } from "class-validator";
import { UserStatus } from "src/user-statuses/entities/user-status.entity";
import { User } from "src/users/entities/user.entity";
import { UserStatuses } from "src/users/enums/user-statuses.enum";
import { Exists } from "src/validation/exists.constrain";
import { IsUnique } from "src/validation/is-unique.constrain";
import { IsMimeType } from "src/validation/mime-type.constrain";

@Exclude()
export class CreateClientDto {
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
  @IsString()
  @MaxLength(250)
  @MinLength(2)
  readonly name: string;

  @Expose()
  @Exists(UserStatus, 'code')
  readonly userStatusCode: UserStatuses;

  @Expose()
  @IsPhoneNumber()
  readonly phoneNumber: string;

  @Expose()
  @IsMimeType(['image/jpeg', 'image/png'])
  readonly image: Express.Multer.File;
}

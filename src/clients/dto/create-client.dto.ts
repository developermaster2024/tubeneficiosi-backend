import { Exclude, Expose, Transform } from "class-transformer";
import { IsEmail, IsPhoneNumber, IsString, MaxLength, MinLength } from "class-validator";
import { User } from "src/users/entities/user.entity";
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
  @Transform(({value}) => value === 'on')
  readonly isActive: boolean;

  @Expose()
  @IsPhoneNumber()
  readonly phoneNumber: string;

  @Expose()
  @IsMimeType(['image/jpeg', 'image/png'])
  readonly image: Express.Multer.File;
}

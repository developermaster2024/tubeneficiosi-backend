import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { IsUnique } from 'src/validation/is-unique.constrain';

@Exclude()
export class RegisterClientDto {
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
  @MaxLength(50)
  readonly phoneNumber: string;

  @Expose()
  @IsString()
  @MinLength(8)
  readonly password: string;
}

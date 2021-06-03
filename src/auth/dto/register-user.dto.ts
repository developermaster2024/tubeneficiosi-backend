import { Expose } from 'class-transformer';
import { IsEmail, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { IsUnique } from 'src/validation/is-unique.constrain';

export class RegisterUserDto {
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
  @IsPhoneNumber()
  readonly phoneNumber: string;

  @Expose()
  @IsString()
  @MinLength(8)
  readonly password: string;
}

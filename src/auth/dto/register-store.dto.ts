import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import { StoreCategory } from "src/store-categories/entities/store-category.entity";
import { User } from "src/users/entities/user.entity";
import { Exists } from "src/validation/exists.constrain";
import { IsUnique } from "src/validation/is-unique.constrain";

@Exclude()
export class RegisterStoreDto {
  @Expose()
  @IsNotEmpty()
  @MaxLength(250)
  readonly name: string;

  @Expose()
  @IsNotEmpty()
  @MaxLength(255)
  readonly slug: string;

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

  @Expose()
  @MinLength(2)
  @MaxLength(255)
  readonly address: string;

  @Expose()
  @IsNumber()
  @Min(-90)
  @Max(90)
  readonly latitude: number;

  @Expose()
  @IsNumber()
  @Min(-180)
  @Max(180)
  readonly longitude: number;

  @Expose()
  @Exists(StoreCategory)
  readonly storeCategoryId: number;
}

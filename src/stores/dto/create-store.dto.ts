import { Exclude, Expose, Transform, Type } from "class-transformer";
import { IsEmail, IsNumber, IsPhoneNumber, IsString, IsUrl, Max, MaxLength, Min, MinLength } from "class-validator";
import { StoreCategory } from "src/store-categories/entities/store-category.entity";
import { UserStatus } from "src/user-statuses/entities/user-status.entity";
import { User } from "src/users/entities/user.entity";
import { UserStatuses } from "src/users/enums/user-statuses.enum";
import { Exists } from "src/validation/exists.constrain";
import { IsUnique } from "src/validation/is-unique.constrain";
import { Store } from "../entities/store.entity";

@Exclude()
export class CreateStoreDto {
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

  @Expose()
  @IsString()
  @MaxLength(250)
  @MinLength(2)
  @IsUnique(Store)
  readonly name: string;

  @Expose()
  @IsPhoneNumber()
  readonly phoneNumber: string;

  @Expose()
  @MinLength(2)
  @MaxLength(255)
  readonly address: string;

  @Expose()
  @Exists(StoreCategory)
  readonly storeCategoryId: number;

  @Expose()
  @IsPhoneNumber()
  readonly whatsapp: string;

  @Expose()
  @IsUrl()
  readonly instagram: string;

  @Expose()
  @IsUrl()
  readonly facebook: string;

  @Expose()
  @IsUrl()
  readonly videoUrl: string;

  @Expose()
  @IsString()
  @MaxLength(255)
  readonly shortDescription: string;

  @Expose()
  @MaxLength(2500)
  readonly description: string;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  readonly latitude: number;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  readonly longitude: number;
}

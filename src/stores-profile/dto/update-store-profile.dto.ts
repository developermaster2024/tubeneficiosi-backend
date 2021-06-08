import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsPhoneNumber, IsString, IsUrl, MaxLength, MinLength } from "class-validator";
import { RegisterStoreDto } from "src/auth/dto/register-store.dto";
import { User } from "src/users/entities/user.entity";
import { IsUnique } from "src/validation/is-unique.constrain";
import { Not } from "typeorm";

@Exclude()
export class UpdateStoreProfileDto extends OmitType(RegisterStoreDto, ['password', 'email', 'latitude', 'longitude']) {
  @Expose()
  readonly userId: number;

  @Expose()
  @IsEmail()
  @MaxLength(150)
  @IsUnique(User, (value, dto: UpdateStoreProfileDto) => ({
    where: {email: value, id: Not(dto.userId)}
  }))
  readonly email: string;

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
  readonly youtube: string;

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
  readonly latitude: number;

  @Expose()
  readonly longitude: number;
}

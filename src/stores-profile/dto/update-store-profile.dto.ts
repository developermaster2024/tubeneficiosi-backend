import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose, Transform, Type } from "class-transformer";
import { IsArray, IsEmail, IsNumber, IsPhoneNumber, IsString, Max, MaxLength, Min } from "class-validator";
import { RegisterStoreDto } from "src/auth/dto/register-store.dto";
import { User } from "src/users/entities/user.entity";
import { IsUnique } from "src/validation/is-unique.constrain";
import { Not } from "typeorm";

@Exclude()
export class UpdateStoreProfileDto extends OmitType(RegisterStoreDto, ['password', 'email', 'slug', 'latitude', 'longitude', 'storeCategoryId']) {
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
  @IsString()
  readonly instagram: string;

  @Expose()
  @IsString()
  readonly facebook: string;

  @Expose()
  @IsString()
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

  @Expose()
  @Transform(({value}) => value || [])
  @IsArray()
  readonly storeFeatureIds: number[];
}

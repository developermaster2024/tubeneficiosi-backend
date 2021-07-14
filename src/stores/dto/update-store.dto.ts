import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";
import { User } from "src/users/entities/user.entity";
import { IsUnique } from "src/validation/is-unique.constrain";
import { Not } from "typeorm";
import { Store } from "../entities/store.entity";
import { CreateStoreDto } from "./create-store.dto";

@Exclude()
export class UpdateStoreDto extends OmitType(CreateStoreDto, ['email', 'name', 'password', 'storeCategoryId'] as const) {
  @Expose()
  readonly id: string;

  @Expose()
  @IsEmail()
  @MaxLength(150)
  @IsUnique(User, (value, dto: UpdateStoreDto) => ({
    where: {email: value, id: Not(dto.id)}
  }))
  readonly email: string;

  @Expose()
  @IsString()
  @MaxLength(250)
  @MinLength(2)
  @IsUnique(Store, (value, dto: UpdateStoreDto) => ({
    where: {name: value, userId: Not(dto.id)},
  }))
  readonly name: string;
}

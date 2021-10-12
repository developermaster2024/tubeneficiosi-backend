import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose, Transform } from "class-transformer";
import { IsArray, IsEmail, IsString, MaxLength, MinLength } from "class-validator";
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
    join: {
      alias: 'user',
      leftJoin: {
        store: 'user.store',
      },
    },
    where: qb => {
      qb.where({ email: value })
        .andWhere('store.id <> :storeId', { storeId: dto.id })
    }
  }))
  readonly email: string;

  @Expose()
  @IsString()
  @MaxLength(250)
  @MinLength(2)
  @IsUnique(Store, (value, dto: UpdateStoreDto) => ({
    where: {name: value, id: Not(dto.id)},
  }))
  readonly name: string;

  @Expose()
  @Transform(({value}) => value || [])
  @IsArray()
  readonly storeFeatureIds: number[];
}

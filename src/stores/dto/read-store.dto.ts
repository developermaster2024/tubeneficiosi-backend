import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose, plainToClass, Transform } from "class-transformer";
import { ReadStoreCategoryDto } from "src/store-categories/dto/read-store-categories.dto";
import { ReadStoreProfileDto } from "src/stores-profile/dto/read-store-profile.dto";
import { ReadUserDto } from "src/users/dto/read-user.dto";
import { User } from "src/users/entities/user.entity";

@Exclude()
export class ReadStoreDto extends OmitType(ReadUserDto, ['role']) {
  @Expose()
  @Transform(({obj}: {obj: User}) => obj.store.name)
  readonly name: string;

  @Expose()
  @Transform(({obj}: {obj: User}) => obj.store.phoneNumber)
  readonly phoneNumber: string;

  @Expose()
  @Transform(({obj}: {obj: User}) => obj.store.address)
  readonly address: string;

  @Expose()
  @Transform(({obj}: {obj: User}) => obj.store.latitude)
  readonly latitude: string;

  @Expose()
  @Transform(({obj}: {obj: User}) => obj.store.longitude)
  readonly longitude: string;

  @Expose()
  @Transform(({obj: {store: {storeCategory}}}: {obj: User}) => {
    if (!storeCategory || storeCategory instanceof ReadStoreCategoryDto) {
      return storeCategory;
    }

    return plainToClass(ReadStoreCategoryDto, storeCategory);
  })
  readonly storeCategory: ReadStoreCategoryDto;

  @Expose()
  @Transform(({obj: {store: {storeProfile}}}: {obj: User}) => {
    if (!storeProfile || storeProfile instanceof ReadStoreProfileDto) {
      return storeProfile;
    }

    return plainToClass(ReadStoreProfileDto, storeProfile);
  })
  readonly storeProfile: ReadStoreProfileDto;
}

import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose, plainToClass, Transform, Type } from "class-transformer";
import { ReadDiscountDto } from "src/discounts/dto/read-discount.dto";
import { ReadProductDto } from "src/products/dto/read-product.dto";
import { ReadStoreCategoryDto } from "src/store-categories/dto/read-store-categories.dto";
import { ReadStoreFeatureDto } from "src/store-features/dto/read-store-feature.dto";
import { ReadStoreHourDto } from "src/store-hours/dto/read-store-hour.dto";
import { ReadStoreProfileDto } from "src/stores-profile/dto/read-store-profile.dto";
import { ReadUserDto } from "src/users/dto/read-user.dto";
import { User } from "src/users/entities/user.entity";

@Exclude()
export class ReadStoreDto extends OmitType(ReadUserDto, ['role']) {
  @Expose()
  @Transform(({obj}: {obj: User}) => obj.store.name)
  readonly name: string;

  @Expose()
  @Transform(({obj}: {obj: User}) => obj.store.slug)
  readonly slug: string;

  @Expose()
  @Transform(({obj}: {obj: User}) => obj.store.phoneNumber)
  readonly phoneNumber: string;

  @Expose()
  @Transform(({obj}: {obj: User}) => obj.store.address)
  readonly address: string;

  @Expose()
  @Transform(({obj}: {obj: User}) => Number(obj.store.latitude))
  readonly latitude: number;

  @Expose()
  @Transform(({obj}: {obj: User}) => Number(obj.store.longitude))
  readonly longitude: number;

  @Expose()
  @Transform(({obj}: {obj: User}) => obj.store.id)
  readonly storeId: string;

  @Expose()
  @Transform(({obj}: {obj: User}) => obj.store.storeCategoryId)
  readonly storeCategoryId: number;

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

  @Expose()
  @Transform(({obj: {store: {cheapestProduct}}}: {obj: User}) => {
    if (!cheapestProduct || cheapestProduct instanceof ReadProductDto) {
      return cheapestProduct;
    }

    return plainToClass(ReadProductDto, cheapestProduct);
  })
  readonly cheapestProduct: ReadProductDto;

  @Expose()
  @Transform(({obj}: {obj: User}) => obj.store.isOpen)
  readonly isOpen: boolean;

  @Expose()
  @Transform(({obj}: {obj: User}) => obj.store.isFavorite)
  readonly isFavorite: boolean;

  @Expose()
  @Transform(({obj}: {obj: User}) => obj.store.rating)
  readonly rating: boolean;

  @Expose()
  @Transform(({obj: {store: {latestActiveDiscount}}}: {obj: User}) => {
    if (!latestActiveDiscount || latestActiveDiscount instanceof ReadDiscountDto) {
      return latestActiveDiscount;
    }

    return plainToClass(ReadDiscountDto, latestActiveDiscount);
  })
  readonly latestActiveDiscount: ReadDiscountDto;

  @Expose()
  @Transform(({obj: {store: {storeFeatures}}}: {obj: User}) => {
    if (!storeFeatures || storeFeatures instanceof ReadStoreFeatureDto) {
      return storeFeatures;
    }

    return plainToClass(ReadStoreFeatureDto, storeFeatures);
  })
  readonly storeFeatures: ReadStoreFeatureDto;

  @Expose()
  @Transform(({obj: {store: {storeHours}}}: {obj: User}) => {
    if (!storeHours || storeHours instanceof ReadStoreHourDto) {
      return storeHours;
    }

    return plainToClass(ReadStoreHourDto, storeHours);
  })
  readonly storeHours: ReadStoreHourDto;
}

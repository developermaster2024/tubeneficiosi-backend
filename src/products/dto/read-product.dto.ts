import { Exclude, Expose, plainToClass, Transform, Type } from "class-transformer";
import { ReadBrandDto } from "src/brands/dto/read-brand.dto";
import { ReadCategoryDto } from "src/categories/dto/read-category.dto";
import { DeliveryMethodType } from "src/delivery-method-types/entities/delivery-method-type.entity";
import { ProductFeature } from "src/product-features/entities/product-feature.entity";
import { ReadStoreDto } from "src/stores/dto/read-store.dto";
import { User } from "src/users/entities/user.entity";
import { ProductDimension } from "../entities/product-dimension.entity";
import { ProductImage } from "../entities/product-image.entity";

@Exclude()
export class ReadProductDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;

  @Expose()
  readonly slug: string;

  @Expose()
  readonly reference: string;

  @Expose()
  readonly shortDescription: string;

  @Expose()
  readonly description: string;

  @Expose()
  readonly quantity: number;

  @Expose()
  readonly price: number;

  @Expose()
  readonly finalPrice: number;

  @Expose()
  @Type(() => ReadBrandDto)
  readonly brand: ReadBrandDto;

  @Expose()
  readonly productFeatures: ProductFeature[];

  @Expose()
  readonly productDimensions: ProductDimension;

  @Expose()
  readonly productImages: ProductImage[];

  @Expose()
  @Type(() => ReadCategoryDto)
  readonly categories: ReadCategoryDto[];

  @Expose()
  @Transform(({obj}) => plainToClass(ReadStoreDto, User.create({store: obj.store})))
  readonly store: ReadStoreDto;

  @Expose()
  readonly deliveryMethodTypes: DeliveryMethodType[];
}

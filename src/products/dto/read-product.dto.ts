import { Exclude, Expose, plainToClass, Transform, Type } from "class-transformer";
import { ReadBrandDto } from "src/brands/dto/read-brand.dto";
import { ReadCategoryDto } from "src/categories/dto/read-category.dto";
import { DeliveryMethodType } from "src/delivery-method-types/entities/delivery-method-type.entity";
import { ProductFeature } from "src/product-features/entities/product-feature.entity";
import { ReadShowDetailsDto } from "src/shows/dto/read-show-details.dto";
import { ReadShowDto } from "src/shows/dto/read-show.dto";
import { ReadStoreDto } from "src/stores/dto/read-store.dto";
import { ReadTagDto } from "src/tags/dto/read-tag.dto";
import { User } from "src/users/entities/user.entity";
import { ProductDimension } from "../entities/product-dimension.entity";
import { ProductFeatureGroup } from "../entities/product-feature-group.entity";
import { ProductImage } from "../entities/product-image.entity";
import { ProductVideo } from "../entities/product-video.entity";
import { ReadProductDetailsDto } from "./read-product-details.dto";

@Exclude()
export class ReadProductDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;

  @Expose()
  readonly slug: string;

  @Expose()
  readonly description: string;

  @Expose()
  readonly finalPrice: number;

  @Expose()
  readonly productFeatures: ProductFeature[];

  @Expose()
  readonly productFeatureGroups: ProductFeatureGroup[];

  @Expose()
  readonly productDimensions: ProductDimension;

  @Expose()
  @Type(() => ReadProductDetailsDto)
  readonly productDetails: ReadProductDetailsDto;

  @Expose()
  @Type(() => ReadShowDetailsDto)
  readonly showDetails: ReadShowDetailsDto;

  @Expose()
  @Type(() => ReadShowDto)
  readonly shows: ReadShowDto[];

  @Expose()
  @Transform(({value}) => !value ? value : value.sort((a, b) => a.position - b.position))
  readonly productImages: ProductImage[];

  @Expose()
  readonly productVideos: ProductVideo[];

  @Expose()
  @Type(() => ReadCategoryDto)
  readonly categories: ReadCategoryDto[];

  @Expose()
  @Transform(({obj}) => obj.store ? plainToClass(ReadStoreDto, User.create({store: obj.store})) : null)
  readonly store: ReadStoreDto;

  @Expose()
  readonly deliveryMethodTypes: DeliveryMethodType[];

  @Expose()
  @Type(() => ReadTagDto)
  readonly tags: ReadTagDto[];

  @Expose()
  readonly isFavorite: boolean;

  @Expose()
  readonly rating: number;
}

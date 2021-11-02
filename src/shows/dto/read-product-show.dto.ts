import { Exclude, Expose, plainToClass, Transform, Type } from "class-transformer";
import { ReadCategoryDto } from "src/categories/dto/read-category.dto";
import { ProductImage } from "src/products/entities/product-image.entity";
import { ReadStoreDto } from "src/stores/dto/read-store.dto";
import { ReadTagDto } from "src/tags/dto/read-tag.dto";
import { User } from "src/users/entities/user.entity";
import { ReadShowDetailsDto } from "./read-show-details.dto";
import { ReadShowDto } from "./read-show.dto";

@Exclude()
export class ReadProductShowDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;

  @Expose()
  readonly slug: string;

  @Expose()
  readonly description: string;

  @Expose()
  @Transform(({value}) => !value ? value : value.sort((a, b) => a.position - b.position))
  readonly productImages: ProductImage[];

  @Expose()
  @Type(() => ReadCategoryDto)
  readonly categories: ReadCategoryDto[];

  @Expose()
  @Type(() => ReadTagDto)
  readonly tags: ReadTagDto[];

  @Expose()
  @Transform(({obj}) => obj.store ? plainToClass(ReadStoreDto, User.create({store: obj.store})) : null)
  readonly store: ReadStoreDto;

  @Expose()
  readonly isFavorite: boolean;

  @Expose()
  readonly rating: number;

  @Expose()
  @Type(() => ReadShowDetailsDto)
  readonly showDetails: ReadShowDetailsDto;

  @Expose()
  @Type(() => ReadShowDto)
  readonly shows: ReadShowDto[];
}

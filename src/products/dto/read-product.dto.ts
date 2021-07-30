import { Exclude, Expose, Type } from "class-transformer";
import { ReadBrandDto } from "src/brands/dto/read-brand.dto";
import { ReadCategoryDto } from "src/categories/dto/read-category.dto";
import { ProductDimension } from "../entities/product-dimension.entity";
import { ProductImage } from "../entities/product-image.entity";
import { ProductToProductFeature } from "../entities/prouct-to-product-feature.entity";

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
  readonly productToProductFeatures: ProductToProductFeature[];

  @Expose()
  readonly productDimensions: ProductDimension;

  @Expose()
  readonly productImages: ProductImage[];

  @Expose()
  @Type(() => ReadCategoryDto)
  readonly categories: ReadCategoryDto[];
}

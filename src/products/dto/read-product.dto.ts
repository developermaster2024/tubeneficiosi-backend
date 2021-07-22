import { Exclude, Expose, Type } from "class-transformer";
import { ReadBrandDto } from "src/brands/dto/read-brand.dto";
import { ProductDimension } from "../entities/product-dimension.entity";
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
  @Type(() => ReadBrandDto)
  readonly brand: ReadBrandDto;

  @Expose()
  readonly productToProductFeatures: ProductToProductFeature[];

  @Expose()
  readonly productDimensions: ProductDimension;
}

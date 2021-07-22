import { Exclude, Expose, Type } from "class-transformer";
import { IsNumber, Min } from "class-validator";
import { ProductFeature } from "src/product-features/entities/product-feature.entity";
import { Exists } from "src/validation/exists.constrain";

@Exclude()
export class CreateProductToProductFeatureDto {
  @Expose()
  @Exists(ProductFeature)
  readonly id: number;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  readonly price: number;
}

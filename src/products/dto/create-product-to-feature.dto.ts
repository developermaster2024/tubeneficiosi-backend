import { Exclude, Expose, Type } from "class-transformer";
import { IsNotEmpty, IsNumber, MaxLength, Min } from "class-validator";
import { ProductFeature } from "src/product-features/entities/product-feature.entity";
import { Exists } from "src/validation/exists.constrain";

@Exclude()
export class CreateProductToProductFeatureDto {
  @Expose()
  @IsNotEmpty()
  @MaxLength(255)
  readonly name: string;

  @Expose()
  @IsNotEmpty()
  @MaxLength(255)
  readonly value: string;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  readonly price: number;
}

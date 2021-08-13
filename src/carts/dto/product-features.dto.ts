import { Exclude, Expose } from "class-transformer";
import { ValidateNested } from "class-validator";
import { ProductFeature } from "src/product-features/entities/product-feature.entity";
import { ProductFeatureForGroup } from "src/products/entities/product-feature-for-group.entity";
import { Exists } from "src/validation/exists.constrain";

@Exclude()
export class ProductFeaturesDto {
  @Expose()
  @ValidateNested({each: true})
  @Exists(ProductFeature)
  readonly featureIds: number[];

  @Expose()
  @ValidateNested({each: true})
  @Exists(ProductFeatureForGroup)
  readonly featureForGroupIds: number[];
}

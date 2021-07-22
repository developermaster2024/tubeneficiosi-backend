import { Exclude, Expose, Transform, Type } from "class-transformer";
import { IsBoolean, MaxLength, ValidateNested } from "class-validator";
import { CreateProductFeatureForGroup } from "./create-product-feature-for-group.dto";

@Exclude()
export class CreateProductFeatureGroup {
  @Expose()
  @MaxLength(255)
  readonly name: string;

  @Expose()
  @Transform(({value}) => value === 'on')
  @IsBoolean()
  readonly isMultiSelectable: boolean;

  @Expose()
  @Type(() => CreateProductFeatureForGroup)
  @ValidateNested({each: true})
  readonly features: CreateProductFeatureForGroup[];
}

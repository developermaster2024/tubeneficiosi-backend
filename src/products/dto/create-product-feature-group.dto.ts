import { Exclude, Expose, Transform, Type } from "class-transformer";
import { ArrayMinSize, IsBoolean, MaxLength, ValidateNested } from "class-validator";
import { CreateProductFeatureForGroup } from "./create-product-feature-for-group.dto";

@Exclude()
export class CreateProductFeatureGroup {
  @Expose()
  @MaxLength(255)
  readonly name: string;

  @Expose()
  @Transform(({value}) => value === 'true')
  @IsBoolean()
  readonly isMultiSelectable: boolean;

  @Expose()
  @Type(() => CreateProductFeatureForGroup)
  @ValidateNested({each: true})
  @ArrayMinSize(1)
  readonly features: CreateProductFeatureForGroup[];
}

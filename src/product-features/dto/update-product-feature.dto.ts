import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose } from "class-transformer";
import { CreateProductFeatureDto } from "./create-product-feature.dto";

@Exclude()
export class UpdateProductFeatureDto extends OmitType(CreateProductFeatureDto, [] as const) {
  @Expose()
  readonly id: string;
}

import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose, Type } from "class-transformer";
import { CreateStoreFeatureDto } from "./create-store-feature.dto";

@Exclude()
export class UpdateStoreFeatureDto extends OmitType(CreateStoreFeatureDto, [] as const) {
  @Expose()
  @Type(() => Number)
  readonly id: number;
}

import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose, Type } from "class-transformer";
import { CreateProductShowDto } from "./create-product-show.dto";

@Exclude()
export class UpdateProductShowDto extends OmitType(CreateProductShowDto, ['slug'] as const) {
  @Expose()
  @Type(() => Number)
  readonly id: number;
}

import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose, Type } from "class-transformer";
import { CreateProductDto } from "./create-product.dto";

@Exclude()
export class UpdateProductDto extends OmitType(CreateProductDto, ['slug'] as const) {
  @Expose()
  @Type(() => Number)
  readonly id: number;
}

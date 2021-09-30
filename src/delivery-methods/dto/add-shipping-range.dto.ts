import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose, Type } from "class-transformer";
import { CreateShippingRangeDto } from "./create-shipping-range.dto";

@Exclude()
export class AddShippingRangeDto extends OmitType(CreateShippingRangeDto, [] as const) {
  @Expose()
  readonly userId: number;

  @Expose()
  @Type(() => Number)
  readonly deliveryMethodId: number;
}

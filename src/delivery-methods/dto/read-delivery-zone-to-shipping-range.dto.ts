import { Exclude, Expose, Type } from "class-transformer";
import { ReadShippingRangeDto } from "./read-shipping-range.dto";

@Exclude()
export class ReadDeliveryZoneToShippingRangeDto {
  @Expose()
  readonly id: number;

  @Expose()
  @Type(() => Number)
  readonly price: number;

  @Expose()
  @Type(() => ReadShippingRangeDto)
  readonly shippingRange: ReadShippingRangeDto;
}

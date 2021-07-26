import { Exclude, Expose, Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { CreateDeliveryZoneDto } from "./create-delivery-zone.dto";
import { CreateShippingRangeDto } from "./create-shipping-range.dto";

@Exclude()
export class CreateShippingZoneToRangeDto {
  @Expose()
  @Type(() => CreateDeliveryZoneDto)
  @ValidateNested()
  readonly deliveryZone: CreateDeliveryZoneDto;

  @Expose()
  @Type(() => CreateShippingRangeDto)
  @ValidateNested({each: true})
  readonly deliveryRanges: CreateShippingRangeDto[];
}

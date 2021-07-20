import { Exclude, Expose, Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { CreateDeliveryRangeDto } from "./create-delivery-range.dto";
import { CreateDeliveryZoneDto } from "./create-delivery-zone.dto";

@Exclude()
export class CreateDeliveryZoneToRangeDto {
  @Expose()
  @Type(() => CreateDeliveryZoneDto)
  @ValidateNested()
  readonly deliveryZone: CreateDeliveryZoneDto;

  @Expose()
  @Type(() => CreateDeliveryRangeDto)
  @ValidateNested({each: true})
  readonly deliveryRanges: CreateDeliveryRangeDto[];
}

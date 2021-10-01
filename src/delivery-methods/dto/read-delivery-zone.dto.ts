import { Exclude, Expose, Type } from "class-transformer";
import { ReadLocationDto } from "src/locations/dto/read-location.dto";
import { ReadDeliveryZoneToDeliveryRangeDto } from "./read-delivery-zone-to-delivery-range.dto";
import { ReadDeliveryZoneToShippingRangeDto } from "./read-delivery-zone-to-shipping-range.dto";

@Exclude()
export class ReadDeliveryZoneDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;

  @Expose()
  @Type(() => Number)
  readonly extraPrice: number;

  @Expose()
  @Type(() => ReadDeliveryZoneToDeliveryRangeDto)
  readonly deliveryZoneToDeliveryRanges: ReadDeliveryZoneToDeliveryRangeDto[];

  @Expose()
  @Type(() => ReadDeliveryZoneToShippingRangeDto)
  readonly deliveryZoneToShippingRanges: ReadDeliveryZoneToShippingRangeDto[];

  @Expose()
  @Type(() => ReadLocationDto)
  readonly locations: ReadLocationDto;
}

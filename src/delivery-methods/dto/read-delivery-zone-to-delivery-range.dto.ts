import { Exclude, Expose, Type } from "class-transformer";
import { ReadDeliveryRangeDto } from "./read-delivery-range.dto";

@Exclude()
export class ReadDeliveryZoneToDeliveryRangeDto {
  @Expose()
  readonly id: number;

  @Expose()
  @Type(() => Number)
  readonly price: number;

  @Expose()
  @Type(() => ReadDeliveryRangeDto)
  readonly deliveryRange: ReadDeliveryRangeDto;
}

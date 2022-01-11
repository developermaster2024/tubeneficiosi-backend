import { Exclude, Expose, Type } from "class-transformer";
import { DeliveryMethodType } from "src/delivery-method-types/entities/delivery-method-type.entity";
import { DeliveryRange } from "../entities/delivery-range.entity";
import { DeliveryZone } from "../entities/delivery-zone.entity";
import { ShippingRange } from "../entities/shipping-range.entity";
import { ReadDeliveryZoneDto } from "./read-delivery-zone.dto";

@Exclude()
export class ReadDeliveryMethodDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;

  @Expose()
  readonly description: string;

  @Expose()
  readonly imgPath: string;

  @Expose()
  readonly deliveryMethodType: DeliveryMethodType;

  @Expose()
  @Type(() => ReadDeliveryZoneDto)
  readonly deliveryZones: ReadDeliveryZoneDto[];

  @Expose()
  readonly shippingRanges: ShippingRange[];

  @Expose()
  readonly deliveryRanges: DeliveryRange[];

  @Expose()
  readonly deliveryCost: number;
}

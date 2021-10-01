import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose, Type } from "class-transformer";
import { CreateDeliveryZoneDto } from "./create-delivery-zone.dto";

@Exclude()
export class AddDeliveryZoneDto extends OmitType(CreateDeliveryZoneDto, [] as const) {
  @Expose()
  readonly userId: number;

  @Expose()
  @Type(() => Number)
  readonly deliveryMethodId: number;
}

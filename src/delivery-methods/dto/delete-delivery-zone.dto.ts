import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class DeleteDeliveryZoneDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @Type(() => Number)
  readonly deliveryZoneId: number;
}

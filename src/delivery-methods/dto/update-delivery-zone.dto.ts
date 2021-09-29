import { Exclude, Expose, Type } from "class-transformer";
import { Min } from "class-validator";

@Exclude()
export class UpdateDeliveryZoneDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @Type(() => Number)
  readonly deliveryZoneId: number;

  @Expose()
  @Type(() => Number)
  @Min(0)
  readonly extraPrice: number;
}

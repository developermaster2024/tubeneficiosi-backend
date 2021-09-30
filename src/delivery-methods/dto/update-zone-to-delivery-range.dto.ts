import { Exclude, Expose, Type } from "class-transformer";
import { Min } from "class-validator";

@Exclude()
export class UpdateZoneToDeliveryRangeDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @Type(() => Number)
  readonly zoneToDeliveryRangeId: number;

  @Expose()
  @Type(() => Number)
  @Min(0)
  readonly price: number;
}

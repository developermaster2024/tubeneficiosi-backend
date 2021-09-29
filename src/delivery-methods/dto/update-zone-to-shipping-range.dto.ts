import { Exclude, Expose, Type } from "class-transformer";
import { Min } from "class-validator";

@Exclude()
export class UpdateZoneToShippingRangeDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @Type(() => Number)
  readonly zoneToShippingRangeId: number;

  @Expose()
  @Type(() => Number)
  @Min(0)
  readonly price: number;
}

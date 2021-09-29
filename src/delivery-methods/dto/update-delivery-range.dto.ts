import { Exclude, Expose, Type } from "class-transformer";
import { Min } from "class-validator";

@Exclude()
export class UpdateDeliveryRangeDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @Type(() => Number)
  readonly deliveryRangeId: number;

  @Expose()
  @Type(() => Number)
  @Min(0)
  readonly minProducts: number;

  @Expose()
  @Type(() => Number)
  @Min(0)
  readonly maxProducts: number;
}

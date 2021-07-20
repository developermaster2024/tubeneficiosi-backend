import { Exclude, Expose, Type } from "class-transformer";
import { Min } from "class-validator";

@Exclude()
export class CreateDeliveryRangeDto {
  @Expose()
  @Type(() => Number)
  @Min(0)
  readonly price: number;

  @Expose()
  @Type(() => Number)
  @Min(0)
  readonly minProducts: number;

  @Expose()
  @Type(() => Number)
  @Min(0)
  readonly maxProducts: number;
}

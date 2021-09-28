import { Exclude, Expose, Type } from "class-transformer";
import { Min } from "class-validator";

@Exclude()
export class UpdateShippingRangeDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @Type(() => Number)
  readonly shippingRangeId: number;

  @Expose()
  @Type(() => Number)
  @Min(0)
  readonly weightFrom: number;

  @Expose()
  @Type(() => Number)
  @Min(0)
  readonly weightTo: number;

  @Expose()
  @Type(() => Number)
  @Min(0)
  readonly volumeFrom: number;

  @Expose()
  @Type(() => Number)
  @Min(0)
  readonly volumeTo: number;
}

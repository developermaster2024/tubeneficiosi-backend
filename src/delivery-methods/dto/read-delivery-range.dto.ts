import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ReadDeliveryRangeDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly minProducts: number;

  @Expose()
  readonly maxProducts: number;

  @Expose()
  readonly position: number;
}

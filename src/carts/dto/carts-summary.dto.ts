import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class CartsSummaryDto {
  @Expose()
  @Type(() => Number)
  readonly totalAverage: number;

  @Expose()
  @Type(() => Number)
  readonly totalAverageWithDiscount: number;

  @Expose()
  @Type(() => Number)
  readonly numberOfCartsThisWeek: number;
}

import { Exclude, Expose } from "class-transformer";

@Exclude()
export class DashboardSummaryDto {
  @Expose()
  readonly clientsCount: number;

  @Expose()
  readonly storesCount: number;

  @Expose()
  readonly ordersCount: number;

  @Expose()
  readonly productsCount: number;

  @Expose()
  readonly adsCount: number;
}

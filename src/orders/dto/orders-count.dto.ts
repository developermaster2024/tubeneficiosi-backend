import { Exclude, Expose } from "class-transformer";

@Exclude()
export class OrdersCountDto {
  @Expose()
  readonly processing: number;

  @Expose()
  readonly completed: number;

  @Expose()
  readonly canceled: number;
}

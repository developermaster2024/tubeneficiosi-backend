import { Exclude, Expose, Type } from "class-transformer";
import { OrderStatuses } from "src/order-statuses/enums/order-statuses.enum";

@Exclude()
export class UpdateOrderStatusDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @Type(() => Number)
  readonly id: number;

  @Expose()
  readonly orderStatusCode: OrderStatuses;
}

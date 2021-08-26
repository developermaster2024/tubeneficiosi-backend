import { Exclude, Expose, Transform } from "class-transformer";
import { format } from "date-fns";
import { OrderStatus } from "src/order-statuses/entities/order-status.entity";

@Exclude()
export class ReadOrderStatusHistoryDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly prevOrderStatus: OrderStatus;

  @Expose()
  readonly newOrderStatus: OrderStatus;

  @Expose()
  @Transform(({value}) => format(value, 'yyyy-MM-dd HH:mm:ss'))
  readonly createdAt: string;
}

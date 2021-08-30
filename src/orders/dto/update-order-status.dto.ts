import { Exclude, Expose, Type } from "class-transformer";
import { IsNotEmpty, MaxLength, ValidateIf } from "class-validator";
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

  @Expose()
  @ValidateIf((obj) => [OrderStatuses.PAYMENT_REJECTED, OrderStatuses.SHIPPING_ERROR].includes(obj.orderStatusCode))
  @IsNotEmpty()
  @MaxLength(255)
  readonly reason: string;
}

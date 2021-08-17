import { Exclude, Expose, Type } from "class-transformer";
import { BankTransfer } from "src/bank-transfers/entities/bank-transfer.entity";
import { ReadCartDto } from "src/carts/dto/read-cart.dto";
import { Delivery } from "src/deliveries/entities/delivery.entity";
import { ReadDeliveryMethodDto } from "src/delivery-methods/dto/read-delivery-method.dto";
import { OrderStatus } from "src/order-statuses/entities/order-status.entity";
import { ReadPaymentMethodDto } from "src/payment-methods/dto/read-payment-method.dto";

@Exclude()
export class ReadOrderDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly orderNumber: string;

  @Expose()
  readonly orderStatus: OrderStatus;

  @Expose()
  @Type(() => ReadPaymentMethodDto)
  readonly paymentMethod: ReadPaymentMethodDto;

  @Expose()
  @Type(() => ReadDeliveryMethodDto)
  readonly deliveryMethod: ReadDeliveryMethodDto;

  @Expose()
  readonly delivery: Delivery;

  @Expose()
  @Type(() => ReadCartDto)
  readonly cart: ReadCartDto;

  @Expose()
  readonly bankTransfers: BankTransfer[];

  @Expose()
  readonly total: number;
}

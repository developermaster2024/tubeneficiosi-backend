import { Exclude, Expose, plainToClass, Transform, Type } from "class-transformer";
import { format } from "date-fns";
import { BankTransfer } from "src/bank-transfers/entities/bank-transfer.entity";
import { ReadCartDto } from "src/carts/dto/read-cart.dto";
import { ReadClientDto } from "src/clients/dto/read-client.dto";
import { Delivery } from "src/deliveries/entities/delivery.entity";
import { ReadDeliveryMethodDto } from "src/delivery-methods/dto/read-delivery-method.dto";
import { OrderStatus } from "src/order-statuses/entities/order-status.entity";
import { ReadPaymentMethodDto } from "src/payment-methods/dto/read-payment-method.dto";
import { ReadStoreDto } from "src/stores/dto/read-store.dto";
import { User } from "src/users/entities/user.entity";

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

  @Expose()
  @Transform(({value}) => format(value, 'yyyy-MM-dd HH:mm:ss'))
  readonly createdAt: string;

  @Expose()
  @Transform(({obj}) => obj.store ? plainToClass(ReadStoreDto, User.create({store: obj.store})) : null)
  readonly store: ReadStoreDto;

  @Expose()
  @Type(() => ReadClientDto)
  readonly user: ReadClientDto;
}

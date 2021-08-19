import { Exclude, Expose } from "class-transformer";
import { ArrayMinSize, ValidateIf, ValidateNested } from "class-validator";
import { Cart } from "src/carts/entities/cart.entity";
import { DeliveryMethod } from "src/delivery-methods/entities/delivery-method.entity";
import { PaymentMethod } from "src/payment-methods/entities/payment-method.entity";
import { PaymentMethods } from "src/payment-methods/enum/payment-methods.enum";
import { ProfileAddress } from "src/profile-addresses/entities/profile-address.entity";
import { Exists } from "src/validation/exists.constrain";
import { CreateBankTransferDto } from "./create-bank-transfer.dto";

@Exclude()
export class CreateOrderDto {
  @Expose()
  readonly userId: number;

  @Expose()
  readonly cartId: number;

  @Expose()
  @ValidateIf((obj) => obj.deliveryMethodId)
  @Exists(DeliveryMethod)
  // @TODO: Validar que este método de envío pertenezca a la tienda
  readonly deliveryMethodId?: number;

  @Expose()
  @ValidateIf((obj) => obj.deliveryMethodId)
  @Exists(ProfileAddress)
  readonly profileAddressId?: number;

  @Expose()
  @Exists(PaymentMethod, 'code')
  // @TODO: Validar que la tienda tenga este método de pago activo
  readonly paymentMethodCode: PaymentMethods;

  @Expose()
  @ValidateIf((obj) => obj.paymentMethodCode === PaymentMethods.BANK_TRANSFER || obj.paymentMethodCode === PaymentMethods.CASH)
  @ArrayMinSize(1)
  @ValidateNested({each: true})
  readonly bankTransfers: CreateBankTransferDto[];
}

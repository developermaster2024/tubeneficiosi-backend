import { Exclude, Expose } from "class-transformer";
import { ValidateIf } from "class-validator";
import { IsMimeType } from "src/validation/mime-type.constrain";
import { PaymentMethods } from "../enum/payment-methods.enum";

@Exclude()
export class UpdatePaymentMethodDto {
  @Expose()
  readonly code: PaymentMethods;

  @Expose()
  @ValidateIf(obj => obj.image)
  @IsMimeType(['image/jpeg', 'image/png'])
  readonly image: Express.Multer.File;
}

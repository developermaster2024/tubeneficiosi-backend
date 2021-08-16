import { Exclude, Expose } from "class-transformer";
import { MaxLength } from "class-validator";
import { BankAccountPurpose } from "src/bank-account-purposes/entities/bank-account-purpose.entity";
import { BankAccountType } from "src/bank-account-types/entities/bank-account-type.entity";
import { CardIssuer } from "src/card-issuers/entities/card-issuer.entity";
import { PaymentMethod } from "src/payment-methods/entities/payment-method.entity";
import { PaymentMethods } from "src/payment-methods/enum/payment-methods.enum";
import { Exists } from "src/validation/exists.constrain";

@Exclude()
export class CreateBankAccountDto {
  @Expose()
  @MaxLength(255)
  readonly accountNumber: string;

  @Expose()
  @MaxLength(255)
  readonly cbu: string;

  @Expose()
  @MaxLength(255)
  readonly alias: string;

  @Expose()
  @MaxLength(255)
  readonly branchOffice: string;

  @Expose()
  @Exists(CardIssuer)
  readonly cardIssuerId: number;

  @Expose()
  @Exists(BankAccountType)
  readonly bankAccountTypeId: number;

  @Expose()
  @Exists(PaymentMethod, 'code', (value) => ({
    where: { code: value, usesBankAccounts: true }
  }))
  readonly paymentMethodCode: PaymentMethods;
}

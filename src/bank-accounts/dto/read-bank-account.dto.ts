import { Exclude, Expose, Type } from "class-transformer";
import { BankAccountType } from "src/bank-account-types/entities/bank-account-type.entity";
import { ReadCardIssuerDto } from "src/card-issuers/dto/read-card-issuer.dto";
import { ReadPaymentMethodDto } from "src/payment-methods/dto/read-payment-method.dto";

@Exclude()
export class ReadBankAccountDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly accountNumber: string;

  @Expose()
  readonly cbu: string;

  @Expose()
  readonly alias: string;

  @Expose()
  readonly branchOffice: string;

  @Expose()
  @Type(() => BankAccountType)
  readonly bankAccountType: BankAccountType;

  @Expose()
  @Type(() => ReadCardIssuerDto)
  readonly cardIssuer: ReadCardIssuerDto;

  @Expose()
  @Type(() => ReadPaymentMethodDto)
  readonly paymentMethod: ReadPaymentMethodDto;
}

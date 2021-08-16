import { Exclude, Expose, Type } from "class-transformer";
import { ReadBankAccountDto } from "src/bank-accounts/dto/read-bank-account.dto";

@Exclude()
export class ReadPaymentMethodDto {
  @Expose()
  readonly code: number;

  @Expose()
  readonly name: string;

  @Expose()
  readonly imgPath: string;

  @Expose()
  readonly usesBankAccounts: boolean;

  @Expose()
  @Type(() => ReadBankAccountDto)
  readonly bankAccounts: ReadBankAccountDto[];
}

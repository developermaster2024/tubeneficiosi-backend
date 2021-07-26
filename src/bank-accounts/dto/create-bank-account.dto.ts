import { Exclude, Expose } from "class-transformer";
import { MaxLength } from "class-validator";
import { BankAccountPurpose } from "src/bank-account-purposes/entities/bank-account-purposes.entity";
import { BankAccountType } from "src/bank-account-types/entities/bank-account-type.entity";
import { CardIssuer } from "src/card-issuers/entities/card-issuer.entity";
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
  @Exists(BankAccountPurpose, 'code')
  readonly bankAccountPurposeCode: string;
}

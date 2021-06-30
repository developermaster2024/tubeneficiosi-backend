import { Exclude, Expose } from "class-transformer";
import { MaxLength } from "class-validator";
import { BankAccountType } from "src/bank-account-types/entities/bank-account-type.entity";
import { Bank } from "src/banks/entities/bank.entity";
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
  @Exists(Bank)
  readonly bankId: number;

  @Expose()
  @Exists(BankAccountType)
  readonly bankAccountTypeId: number;
}

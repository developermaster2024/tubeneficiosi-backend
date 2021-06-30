import { Exclude, Expose } from "class-transformer";
import { MaxLength } from "class-validator";
import { IsUnique } from "src/validation/is-unique.constrain";
import { BankAccountType } from "../entities/bank-account-type.entity";

@Exclude()
export class CreateBankAccountTypeDto {
  @Expose()
  @MaxLength(250)
  @IsUnique(BankAccountType)
  readonly name: string;
}

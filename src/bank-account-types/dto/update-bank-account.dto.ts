import { Exclude, Expose } from "class-transformer";
import { MaxLength } from "class-validator";
import { IsUnique } from "src/validation/is-unique.constrain";
import { Not } from "typeorm";
import { BankAccountType } from "../entities/bank-account-type.entity";

@Exclude()
export class UpdateBankAccountTypeDto {
  @Expose()
  readonly id: string;

  @Expose()
  @MaxLength(250)
  @IsUnique(BankAccountType, (value, dto: UpdateBankAccountTypeDto) => ({
    where: {name: value, id: Not(dto.id)},
  }))
  readonly name: string;
}

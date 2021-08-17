import { Exclude, Expose, Type } from "class-transformer";
import { IsNotEmpty, Min } from "class-validator";
import { BankAccount } from "src/bank-accounts/entities/bank-account.entity";
import { Exists } from "src/validation/exists.constrain";

@Exclude()
export class CreateBankTransferDto {
  @Expose()
  @IsNotEmpty()
  readonly reference: string;

  @Expose()
  @Type(() => Number)
  @Min(0)
  readonly amount: number;

  @Expose()
  // @TODO: Validar que la cuenta bancaria pertenezca al método de pago seleccionado
  @Exists(BankAccount)
  readonly bankAccountId: number;
}

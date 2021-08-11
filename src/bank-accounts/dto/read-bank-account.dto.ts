import { Exclude, Expose, Type } from "class-transformer";
import { BankAccountPurpose } from "src/bank-account-purposes/entities/bank-account-purpose.entity";
import { BankAccountType } from "src/bank-account-types/entities/bank-account-type.entity";
import { ReadCardIssuerDto } from "src/card-issuers/dto/read-card-issuer.dto";

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
  @Type(() => BankAccountPurpose)
  readonly bankAccountPurpose: BankAccountPurpose;
}

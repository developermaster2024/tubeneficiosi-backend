import { Exclude, Expose, Type } from "class-transformer";
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
  readonly bankAccountTypeId: number;

  @Expose()
  @Type(() => ReadCardIssuerDto)
  readonly cardIssuer: ReadCardIssuerDto;
}

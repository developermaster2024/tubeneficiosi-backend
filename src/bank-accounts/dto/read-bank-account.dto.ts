import { Exclude, Expose, Type } from "class-transformer";
import { ReadBankDto } from "src/banks/dto/read-bank.dto";

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
  readonly bankId: number;

  @Expose()
  readonly bankAccountTypeId: number;

  @Expose()
  @Type(() => ReadBankDto)
  readonly bank: ReadBankDto;
}

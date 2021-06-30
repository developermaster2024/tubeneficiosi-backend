import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose } from "class-transformer";
import { CreateBankAccountDto } from "./create-bank-account.dto";

@Exclude()
export class UpdateBankAccountDto extends OmitType(CreateBankAccountDto, [] as const) {
  @Expose()
  readonly id: string;
}

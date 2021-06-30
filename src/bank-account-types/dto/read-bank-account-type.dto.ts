import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ReadBankAccountTypeDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;
}

import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ReadBankDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;

  @Expose()
  readonly imgPath: string;
}

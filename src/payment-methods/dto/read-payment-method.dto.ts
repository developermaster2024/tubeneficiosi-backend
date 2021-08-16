import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ReadPaymentMethodDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;

  @Expose()
  readonly imgPath: string;

  @Expose()
  readonly usesBankAccounts: boolean;
}

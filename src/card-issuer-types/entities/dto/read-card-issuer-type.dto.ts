import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ReadCardIssuerType {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;
}

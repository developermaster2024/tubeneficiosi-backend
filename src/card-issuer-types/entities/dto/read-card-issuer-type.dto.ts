import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ReadCardIssuerTypeDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;
}

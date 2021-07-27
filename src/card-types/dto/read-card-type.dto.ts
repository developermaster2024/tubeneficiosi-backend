import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ReadCardTypeDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;
}

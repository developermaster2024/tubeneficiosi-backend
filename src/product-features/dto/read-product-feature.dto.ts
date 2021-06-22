import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ReadProductFeatureDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;
}

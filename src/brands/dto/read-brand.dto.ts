import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ReadBrandDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;
}

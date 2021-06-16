import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ReadLocationDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;

  @Expose()
  readonly area: string;
}

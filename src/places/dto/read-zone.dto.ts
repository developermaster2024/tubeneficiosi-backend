import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ReadZoneDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;

  @Expose()
  readonly capacity: number;
}

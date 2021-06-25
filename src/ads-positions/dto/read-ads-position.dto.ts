import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ReadAdsPositionDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;
}

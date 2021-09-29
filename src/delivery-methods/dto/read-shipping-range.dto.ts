import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class ReadShippingRangeDto {
  @Expose()
  readonly id: number;

  @Expose()
  @Type(() => Number)
  readonly weightFrom: number;

  @Expose()
  @Type(() => Number)
  readonly weightTo: number;

  @Expose()
  @Type(() => Number)
  readonly volumeFrom: number;

  @Expose()
  @Type(() => Number)
  readonly volumeTo: number;

  @Expose()
  readonly position: number;
}

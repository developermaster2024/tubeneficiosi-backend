import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class DeleteZoneDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @Type(() => Number)
  readonly zoneId: number;
}

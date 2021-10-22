import { Exclude, Expose, Type } from "class-transformer";
import { ReadZoneDto } from "./read-zone.dto";

@Exclude()
export class ReadPlaceDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;

  @Expose()
  readonly imgPath: string;

  @Expose()
  readonly capacity: number;

  @Expose()
  @Type(() => ReadZoneDto)
  readonly zones: ReadZoneDto[];
}

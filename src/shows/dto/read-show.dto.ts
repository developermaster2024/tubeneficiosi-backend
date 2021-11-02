import { Exclude, Expose, Transform, Type } from "class-transformer";
import { format } from "date-fns";
import { ReadPlaceDto } from "src/places/dto/read-place.dto";
import { ReadShowToZoneDto } from "./read-show-to-zone.dto";

@Exclude()
export class ReadShowDto {
  @Expose()
  readonly id: number;

  @Expose()
  @Transform(({value}) => format(value, 'yyyy-MM-dd HH:mm:ss'))
  readonly date: Date;

  @Expose()
  readonly place: ReadPlaceDto;

  @Expose()
  @Type(() => ReadShowToZoneDto)
  readonly showToZones: ReadShowToZoneDto[];
}


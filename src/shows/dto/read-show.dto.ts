import { Exclude, Expose, Transform } from "class-transformer";
import { format } from "date-fns";
import { ReadPlaceDto } from "src/places/dto/read-place.dto";
import { ShowToZone } from "../entities/show-to-zone.entity";

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
  readonly showToZones: ShowToZone[];
}


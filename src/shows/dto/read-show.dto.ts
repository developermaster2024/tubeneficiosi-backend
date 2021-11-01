import { Exclude, Expose } from "class-transformer";
import { ReadPlaceDto } from "src/places/dto/read-place.dto";
import { ShowToZone } from "../entities/show-to-zone.entity";

@Exclude()
export class ReadShowDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly date: Date;

  @Expose()
  readonly place: ReadPlaceDto;

  @Expose()
  readonly showToZones: ShowToZone[];
}


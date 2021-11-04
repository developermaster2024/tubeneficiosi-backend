import { Exclude, Expose } from "class-transformer";
import { ReadZoneDto } from "src/places/dto/read-zone.dto";
import { ReadShowDto } from "src/shows/dto/read-show.dto";

@Exclude()
export class ReadCartItemShowDetailsDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly show: ReadShowDto;

  @Expose()
  readonly zone: ReadZoneDto;
}

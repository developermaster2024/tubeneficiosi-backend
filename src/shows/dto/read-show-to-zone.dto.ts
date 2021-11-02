import { Exclude, Expose, Type } from "class-transformer";
import { ReadZoneDto } from "src/places/dto/read-zone.dto";

@Exclude()
export class ReadShowToZoneDto {
  @Expose()
  readonly id: number;

  @Expose()
  @Type(() => Number)
  readonly price: number;

  @Expose()
  readonly availableSeats: number;

  @Expose()
  readonly zoneId: number;

  @Expose()
  readonly zone: ReadZoneDto;
}

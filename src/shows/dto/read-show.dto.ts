import { Exclude, Expose } from "class-transformer";
import { ReadPlaceDto } from "src/places/dto/read-place.dto";

@Exclude()
export class ReadShowDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly date: Date;

  @Expose()
  readonly place: ReadPlaceDto;
}


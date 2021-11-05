import { Exclude, Expose, Type } from "class-transformer";
import { Min } from "class-validator";
import { Exists } from "src/validation/exists.constrain";
import { ShowToZone } from "../entities/show-to-zone.entity";

@Exclude()
export class UpdateShowToZoneDto {
  @Expose()
  @Exists(ShowToZone)
  readonly id: number;

  @Expose()
  @Type(() => Number)
  @Min(0)
  readonly price: number;

  @Expose()
  @Type(() => Number)
  @Min(0)
  readonly availableSeats: number;
}

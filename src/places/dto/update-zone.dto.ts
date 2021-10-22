import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose } from "class-transformer";
import { CreateZoneDto } from "./create-zone.dto";

@Exclude()
export class UpdateZoneDto extends OmitType(CreateZoneDto, [] as const) {
  @Expose()
  readonly userId: number;

  @Expose()
  readonly zoneId: number;

  @Expose()
  readonly placeId: number;
}

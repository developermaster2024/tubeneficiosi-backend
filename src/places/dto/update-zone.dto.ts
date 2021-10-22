import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose } from "class-transformer";
import { AddZoneDto } from "./add-zone.dto";

@Exclude()
export class UpdateZoneDto extends OmitType(AddZoneDto, [] as const) {
  @Expose()
  readonly zoneId: number;
}

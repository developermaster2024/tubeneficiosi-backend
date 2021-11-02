import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose, Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { AddShowDto } from "./add-show.dto";
import { UpdateShowToZoneDto } from "./update-show-to-zone.dto";

@Exclude()
export class UpdateShowDto extends OmitType(AddShowDto, ['placeId'] as const) {
  @Expose()
  @Type(() => Number)
  readonly showId: number;

  @Expose()
  @Type(() => UpdateShowToZoneDto)
  @ValidateNested({ each: true })
  @IsArray()
  readonly showToZones: UpdateShowToZoneDto[];
}

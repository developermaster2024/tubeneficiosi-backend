import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose } from "class-transformer";
import { CreateLocationDto } from "./create-location.dto";

@Exclude()
export class UpdateLocationDto extends OmitType(CreateLocationDto, [] as const) {
  @Expose()
  readonly id: string;
}

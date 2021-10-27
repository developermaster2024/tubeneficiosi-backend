import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose, Type } from "class-transformer";
import { CreateShowDto } from "./create-show.dto";

@Exclude()
export class UpdateShowDto extends OmitType(CreateShowDto, ['slug'] as const) {
  @Expose()
  @Type(() => Number)
  readonly id: number;
}

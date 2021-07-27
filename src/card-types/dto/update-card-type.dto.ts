import { OmitType } from "@nestjs/mapped-types";
import { Expose, Type } from "class-transformer";
import { CreateCardTypeDto } from "./create-card-type.dto";

export class UpdateCardTypeDto extends OmitType(CreateCardTypeDto, [] as const) {
  @Expose()
  @Type(() => Number)
  readonly id: number;
}

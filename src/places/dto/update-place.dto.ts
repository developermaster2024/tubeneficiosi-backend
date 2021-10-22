import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose, Type } from "class-transformer";
import { ValidateIf } from "class-validator";
import { IsMimeType } from "src/validation/mime-type.constrain";
import { CreatePlaceDto } from "./create-place.dto";

@Exclude()
export class UpdatePlaceDto extends OmitType(CreatePlaceDto, ['image', 'zones'] as const) {
  @Expose()
  @Type(() => Number)
  readonly id: number;

  @Expose()
  @ValidateIf((obj) => obj.image)
  @IsMimeType(['image/png', 'image/jpeg'])
  readonly image: Express.Multer.File;
}

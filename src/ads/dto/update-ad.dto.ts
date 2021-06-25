import { OmitType } from "@nestjs/mapped-types";
import { Expose } from "class-transformer";
import { ValidateIf } from "class-validator";
import { IsMimeType } from "src/validation/mime-type.constrain";
import { CreateAdDto } from "./create-ad.dto";

export class UpdateAdDto extends OmitType(CreateAdDto, ['image'] as const) {
  @Expose()
  readonly id: string;

  @Expose()
  @ValidateIf(o => o.image)
  @IsMimeType(['image/jpeg', 'image/png'])
  readonly image: Express.Multer.File;
}

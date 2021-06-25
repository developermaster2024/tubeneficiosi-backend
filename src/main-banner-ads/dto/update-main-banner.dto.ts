import { OmitType } from "@nestjs/mapped-types";
import { Expose } from "class-transformer";
import { ValidateIf } from "class-validator";
import { IsMimeType } from "src/validation/mime-type.constrain";
import { CreateMainBannerAdDto } from "./create-main-banner-ad.dto";

export class UpdateMainBannerAdDto extends OmitType(CreateMainBannerAdDto, ['image'] as const) {
  @Expose()
  readonly id: string;

  @Expose()
  @ValidateIf(o => o.image)
  @IsMimeType(['image/jpeg', 'image/png'])
  readonly image: Express.Multer.File;
}

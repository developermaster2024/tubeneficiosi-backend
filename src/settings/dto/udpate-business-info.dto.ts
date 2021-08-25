import { Exclude, Expose } from "class-transformer";
import { IsHexColor, MaxLength, ValidateIf } from "class-validator";
import { IsMimeType } from "src/validation/mime-type.constrain";

@Exclude()
export class UpdateBusinessInfoDto {
  @Expose()
  readonly sectionTitle: string;

  @Expose()
  @ValidateIf(obj => obj.leftSectionImage)
  @IsMimeType(['image/png','image/jpeg'])
  readonly leftSectionImage: Express.Multer.File;

  @Expose()
  readonly leftSectionTitle: string;

  @Expose()
  readonly leftSectionText: string;

  @Expose()
  readonly leftSectionBtnColor: string;

  @Expose()
  readonly leftSectionBtnText: string;

  @Expose()
  readonly leftSectionBtnUrl: string;

  @Expose()
  @ValidateIf(obj => obj.rightSectionImage)
  @IsMimeType(['image/png','image/jpeg'])
  readonly rightSectionImage: Express.Multer.File;

  @Expose()
  readonly rightSectionTitle: string;

  @Expose()
  readonly rightSectionText: string;

  @Expose()
  readonly rightSectionBtnColor: string;

  @Expose()
  readonly rightSectionBtnText: string;

  @Expose()
  readonly rightSectionBtnUrl: string;
}

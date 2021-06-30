import { Exclude, Expose } from "class-transformer";
import { MaxLength, ValidateIf } from "class-validator";
import { IsMimeType } from "src/validation/mime-type.constrain";

@Exclude()
export class UpdateNeededInfoDto {
  @Expose()
  @ValidateIf(obj => obj.leftSectionImage)
  @IsMimeType(['image/png', 'image/jpeg'])
  readonly leftSectionImage: Express.Multer.File;

  @Expose()
  readonly leftSectionTitle: string;

  @Expose()
  readonly leftSectionDescription: string;

  @Expose()
  @ValidateIf(obj => obj.middleSectionImage)
  @IsMimeType(['image/png', 'image/jpeg'])
  readonly middleSectionImage: Express.Multer.File;

  @Expose()
  readonly middleSectionTitle: string;

  @Expose()
  readonly middleSectionDescription: string;

  @Expose()
  @ValidateIf(obj => obj.rightSectionImage)
  @IsMimeType(['image/png', 'image/jpeg'])
  readonly rightSectionImage: Express.Multer.File;

  @Expose()
  readonly rightSectionTitle: string;

  @Expose()
  readonly rightSectionDescription: string;
}

import { Exclude, Expose } from "class-transformer";
import { MaxLength } from "class-validator";
import { IsMimeType } from "src/validation/mime-type.constrain";

@Exclude()
export class UpdateNeededInfoDto {
  @Expose()
  @IsMimeType(['image/png', 'image/jpeg'])
  readonly leftSectionImage: Express.Multer.File;

  @Expose()
  @MaxLength(40)
  readonly leftSectionTitle: string;

  @Expose()
  @MaxLength(500)
  readonly leftSectionDescription: string;

  @Expose()
  @IsMimeType(['image/png', 'image/jpeg'])
  readonly middleSectionImage: Express.Multer.File;

  @Expose()
  @MaxLength(40)
  readonly middleSectionTitle: string;

  @Expose()
  @MaxLength(500)
  readonly middleSectionDescription: string;

  @Expose()
  @IsMimeType(['image/png', 'image/jpeg'])
  readonly rightSectionImage: Express.Multer.File;

  @Expose()
  @MaxLength(40)
  readonly rightSectionTitle: string;

  @Expose()
  @MaxLength(500)
  readonly rightSectionDescription: string;
}

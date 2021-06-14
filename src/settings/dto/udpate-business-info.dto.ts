import { Exclude, Expose } from "class-transformer";
import { IsHexColor, MaxLength } from "class-validator";
import { IsMimeType } from "src/validation/mime-type.constrain";

@Exclude()
export class UpdateBusinessInfoDto {
  @Expose()
  @MaxLength(20)
  readonly sectionTitle: string;

  @Expose()
  @IsMimeType(['image/png','image/jpeg'])
  readonly leftSectionImage: Express.Multer.File;

  @Expose()
  @MaxLength(20)
  readonly leftSectionTitle: string;

  @Expose()
  @MaxLength(500)
  readonly leftSectionText: string;

  @Expose()
  @IsHexColor()
  readonly leftSectionBtnColor: string;

  @Expose()
  @MaxLength(20)
  readonly leftSectionBtnText: string;

  @Expose()
  @IsMimeType(['image/png','image/jpeg'])
  readonly rightSectionImage: Express.Multer.File;

  @Expose()
  @MaxLength(20)
  readonly rightSectionTitle: string;

  @Expose()
  @MaxLength(500)
  readonly rightSectionText: string;

  @Expose()
  @IsHexColor()
  readonly rightSectionBtnColor: string;

  @Expose()
  @MaxLength(20)
  readonly rightSectionBtnText: string;
}

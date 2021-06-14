import { Exclude, Expose } from "class-transformer";
import { IsHexColor, MaxLength } from "class-validator";
import { IsMimeType } from "src/validation/mime-type.constrain";

@Exclude()
export class UpdateAppSectionDto {
  @Expose()
  @MaxLength(30)
  readonly title: string;

  @Expose()
  @IsHexColor()
  readonly titleColor: string;

  @Expose()
  @MaxLength(500)
  readonly description: string;

  @Expose()
  @IsHexColor()
  readonly descriptionColor: string;

  @Expose()
  @IsMimeType(['image/png','image/jpeg'])
  readonly leftSideImage: Express.Multer.File;

  @Expose()
  @IsMimeType(['image/png','image/jpeg'])
  readonly rightSideImage: Express.Multer.File;
}

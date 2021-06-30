import { Exclude, Expose } from "class-transformer";
import { ValidateIf } from "class-validator";
import { IsMimeType } from "src/validation/mime-type.constrain";

@Exclude()
export class UpdateAppSectionDto {
  @Expose()
  readonly title: string;

  @Expose()
  readonly titleColor: string;

  @Expose()
  readonly description: string;

  @Expose()
  readonly backgroundColor: string;

  @Expose()
  readonly descriptionColor: string;

  @Expose()
  @ValidateIf(obj => obj.leftSideImage)
  @IsMimeType(['image/png','image/jpeg'])
  readonly leftSideImage: Express.Multer.File;

  @Expose()
  @ValidateIf(obj => obj.rightSideImage)
  @IsMimeType(['image/png','image/jpeg'])
  readonly rightSideImage: Express.Multer.File;
}

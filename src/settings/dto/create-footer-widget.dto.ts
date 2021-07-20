import { Exclude, Expose } from "class-transformer";
import { IsIn, IsUrl, MaxLength, ValidateIf } from "class-validator";
import { IsMimeType } from "src/validation/mime-type.constrain";

@Exclude()
export class CreateFooterWidgetDto {
  @Expose()
  readonly sectionId: string;

  @Expose()
  @IsIn(['text', 'url', 'image', 'socials'])
  readonly type: string;

  @Expose()
  @ValidateIf((obj) => obj.type === 'text' || obj.type === 'url')
  @MaxLength(200)
  readonly value: string;

  @Expose()
  @ValidateIf((obj) => obj.type === 'url')
  @IsUrl()
  readonly url: string;

  @Expose()
  @ValidateIf((obj) => obj.type === 'socials')
  @IsUrl()
  readonly facebook: string;

  @Expose()
  @ValidateIf((obj) => obj.type === 'socials')
  @IsUrl()
  readonly instagram: string;

  @Expose()
  @ValidateIf((obj) => obj.type === 'socials')
  @IsUrl()
  readonly twitter: string;

  @Expose()
  @ValidateIf((obj) => obj.type === 'socials')
  @IsUrl()
  readonly youtube: string;

  @Expose()
  @ValidateIf((obj) => obj.type === 'image')
  @IsMimeType(['image/png', 'image/jpeg'])
  readonly image: Express.Multer.File;
}

import { Exclude, Expose } from "class-transformer";
import { IsMimeType } from "src/validation/mime-type.constrain";

@Exclude()
export class UploadHtmlImageDto {
  @Expose()
  @IsMimeType(['image/png', 'image/jpeg', 'image/gif', 'image/webp'])
  readonly image: Express.Multer.File;
}

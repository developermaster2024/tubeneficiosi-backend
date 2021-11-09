import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, MaxLength } from "class-validator";
import { IsMimeType } from "src/validation/mime-type.constrain";

@Exclude()
export class CreateNewsDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @IsNotEmpty()
  @MaxLength(255)
  readonly title: string;

  @Expose()
  @IsNotEmpty()
  @MaxLength(255)
  readonly redirectUrl: string;

  @Expose()
  @IsMimeType(['image/png', 'image/jpeg'])
  readonly image: Express.Multer.File;
}

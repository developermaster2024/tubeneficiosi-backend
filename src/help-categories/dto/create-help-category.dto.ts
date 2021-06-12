import { Exclude, Expose } from "class-transformer";
import { IsString, MaxLength } from "class-validator";
import { IsUnique } from "src/validation/is-unique.constrain";
import { IsMimeType } from "src/validation/mime-type.constrain";
import { HelpCategory } from "../entities/help-category.entity";

@Exclude()
export class CreateHelpCategoryDto {
  @Expose()
  @IsString()
  @MaxLength(255)
  @IsUnique(HelpCategory)
  readonly name: string;

  @Expose()
  @IsMimeType(['image/jpeg', 'image/png'])
  readonly icon: Express.Multer.File;
}

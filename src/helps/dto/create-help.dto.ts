import { Exclude, Expose } from "class-transformer";
import { IsString, MaxLength } from "class-validator";
import { HelpCategory } from "src/help-categories/entities/help-category.entity";
import { Exists } from "src/validation/exists.constrain";
import { IsUnique } from "src/validation/is-unique.constrain";
import { Help } from "../entities/help.entity";

@Exclude()
export class CreateHelpDto {
  @Expose()
  @IsString()
  @MaxLength(255)
  @IsUnique(Help)
  readonly title: string;

  @Expose()
  @MaxLength(2500)
  readonly description: string;

  @Expose()
  @Exists(HelpCategory)
  readonly helpCategoryId: number;
}

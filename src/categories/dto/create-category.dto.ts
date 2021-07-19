import { Exclude, Expose } from "class-transformer";
import { IsString, MaxLength, ValidateIf } from "class-validator";
import { Exists } from "src/validation/exists.constrain";
import { IsUnique } from "src/validation/is-unique.constrain";
import { Category } from "../entities/category.entity";

@Exclude()
export class CreateCategoryDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @IsString()
  @MaxLength(255)
  @IsUnique(Category)
  readonly name: string;

  @Expose()
  @ValidateIf((obj) => obj.parentId)
  @Exists(Category)
  readonly parentId: number;
}

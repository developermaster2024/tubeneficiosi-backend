import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, ValidateIf } from "class-validator";
import { Exists } from "src/validation/exists.constrain";
import { IsUnique } from "src/validation/is-unique.constrain";
import { Category } from "../entities/category.entity";

@Exclude()
export class CreateCategoryDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly name: string;

  @Expose()
  @ValidateIf((obj) => obj.parentId)
  @Exists(Category)
  readonly parentId: number;
}

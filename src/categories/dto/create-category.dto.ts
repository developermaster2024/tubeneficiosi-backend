import { Exclude, Expose } from "class-transformer";
import { IsString, MaxLength } from "class-validator";
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
  readonly parentIds: number[];
}

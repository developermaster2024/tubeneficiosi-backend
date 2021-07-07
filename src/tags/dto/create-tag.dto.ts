import { Exclude, Expose } from "class-transformer";
import { IsArray, IsString, MaxLength } from "class-validator";
import { StoreCategory } from "src/store-categories/entities/store-category.entity";
import { Exists } from "src/validation/exists.constrain";
import { IsUnique } from "src/validation/is-unique.constrain";
import { Tag } from "../entities/tag.entity";

@Exclude()
export class CreateTagDto {
  @Expose()
  @IsString()
  @MaxLength(255)
  @IsUnique(Tag)
  readonly name: string;

  @Expose()
  @IsArray()
  readonly parentIds: number[];

  @Expose()
  @Exists(StoreCategory)
  readonly storeCategoryId: number;
}

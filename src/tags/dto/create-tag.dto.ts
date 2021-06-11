import { Exclude, Expose } from "class-transformer";
import { IsString, MaxLength } from "class-validator";
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
  readonly parentIds: number[];
}

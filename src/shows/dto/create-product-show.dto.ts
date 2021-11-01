import { Exclude, Expose } from "class-transformer";
import { ArrayMinSize, IsArray, MaxLength, ValidateIf } from "class-validator";

@Exclude()
export class CreateProductShowDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @MaxLength(255)
  readonly name: string;

  @Expose()
  @MaxLength(255)
  readonly slug: string;

  @Expose()
  readonly description: string;

  @Expose()
  @ValidateIf((obj) => obj.tagIds)
  @IsArray()
  @ArrayMinSize(0)
  readonly tagIds: number[];

  @Expose()
  @ValidateIf((obj) => obj.categoryIds)
  @IsArray()
  @ArrayMinSize(0)
  readonly categoryIds: number[];

  @Expose()
  @MaxLength(255)
  readonly trailer: string;
}

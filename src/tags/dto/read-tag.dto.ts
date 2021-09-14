import { Exclude, Expose, Type } from "class-transformer";
import { ReadStoreCategoryDto } from "src/store-categories/dto/read-store-categories.dto";

@Exclude()
export class ReadTagDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;

  @Expose()
  @Type(() => ReadStoreCategoryDto)
  readonly storeCategory: ReadStoreCategoryDto;

  @Expose()
  @Type(() => ReadTagDto)
  readonly parentTags: ReadTagDto[];
}

import { Exclude, Expose, Type } from "class-transformer";
import { ReadTagDto } from "src/tags/dto/read-tag.dto";

@Exclude()
export class TagsSummaryDto {
  @Expose()
  readonly emptyTagsCount: number;

  @Expose()
  @Type(() => ReadTagDto)
  readonly bestTag: ReadTagDto;

  @Expose()
  @Type(() => Number)
  readonly averageProductsPerTag: number;
}

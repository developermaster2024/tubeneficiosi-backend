import { Exclude, Expose, Type } from "class-transformer";
import { ReadHelpCategoryDto } from "src/help-categories/dto/read-help-category.dto";

@Exclude()
export class ReadHelpDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly title: string;

  @Expose()
  readonly description: string;

  @Expose()
  @Type(() => ReadHelpCategoryDto)
  readonly helpCategory: ReadHelpCategoryDto;
}

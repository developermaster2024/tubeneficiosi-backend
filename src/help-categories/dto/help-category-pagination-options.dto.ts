import { PaginationOptions } from "src/support/pagination/pagination-options";

type HelpCategoryFilters = {
  id: string;
  name: string;
};

export class HelpCategoryPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: HelpCategoryFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): HelpCategoryPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      name,
    } = query;
    return new HelpCategoryPaginationOptionsDto(+page, +perPage, {id, name});
  }
}

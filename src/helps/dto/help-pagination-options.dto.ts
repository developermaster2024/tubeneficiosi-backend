import { PaginationOptions } from "src/support/pagination/pagination-options";

type HelpFilters = {
  id: string;
  title: string;
  categoryId: string;
};

export class HelpPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: HelpFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): HelpPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      title,
      categoryId
    } = query;
    return new HelpPaginationOptionsDto(+page, +perPage, {id, title, categoryId});
  }
}

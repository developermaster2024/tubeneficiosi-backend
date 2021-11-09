import { PaginationOptions } from "src/support/pagination/pagination-options";

type NewsFilters = {
  id: number;
};

export class NewsPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: NewsFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): NewsPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
    } = query;
    return new NewsPaginationOptionsDto(+page, +perPage, {
      id: +id,
    });
  }
}

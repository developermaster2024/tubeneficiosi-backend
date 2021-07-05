import { PaginationOptions } from "src/support/pagination/pagination-options";

type StoreAdFilters = {
  id: string;
  date: string;
};

export class StoreAdPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: StoreAdFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): StoreAdPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      date,
    } = query;
    return new StoreAdPaginationOptionsDto(+page, +perPage, {id, date});
  }
}

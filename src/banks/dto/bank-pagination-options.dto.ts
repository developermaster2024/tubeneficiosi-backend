import { PaginationOptions } from "src/support/pagination/pagination-options";

type BankFilters = {
  id: string;
  name: string;
};

export class BankPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: BankFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): BankPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      name,
    } = query;
    return new BankPaginationOptionsDto(+page, +perPage, {id, name});
  }
}

import { PaginationOptions } from "src/support/pagination/pagination-options";

type BrandFilters = {
  id: string;
  name: string;
};

export class BrandPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: BrandFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): BrandPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      name,
    } = query;
    return new BrandPaginationOptionsDto(+page, +perPage, {id, name});
  }
}

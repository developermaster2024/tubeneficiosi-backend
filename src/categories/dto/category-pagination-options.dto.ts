import { PaginationOptions } from "src/support/pagination/pagination-options";

type CategoryFilters = {
  id: string;
  name: string;
  storeId: string;
  parentOnly: boolean;
  parentId: string;
};

export class CategoryPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: CategoryFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): CategoryPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      name,
      storeId,
      parentOnly,
      parentId,
    } = query;

    return new CategoryPaginationOptionsDto(+page, +perPage, {
      id,
      name,
      storeId,
      parentOnly: parentOnly === 'true',
      parentId,
    });
  }
}

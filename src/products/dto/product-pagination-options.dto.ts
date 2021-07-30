import { PaginationOptions } from "src/support/pagination/pagination-options";

type ProductFilters = {
  id: string;
  name: string;
  storeId: number;
};

export class ProductPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: ProductFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): ProductPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      name,
      storeId,
    } = query;
    return new ProductPaginationOptionsDto(+page, +perPage, {
      id,
      name,
      storeId: Number(storeId),
    });
  }
}

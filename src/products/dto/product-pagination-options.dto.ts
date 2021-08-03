import { PaginationOptions } from "src/support/pagination/pagination-options";

type ProductFilters = {
  id: string;
  name: string;
  reference: string;
  minPrice: number;
  maxPrice: number;
  minQuantity: number;
  maxQuantity: number;
  storeId: number;
  storeName: string;
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
      reference,
      minPrice,
      maxPrice,
      minQuantity,
      maxQuantity,
      storeId,
      storeName,
    } = query;
    return new ProductPaginationOptionsDto(+page, +perPage, {
      id,
      name,
      reference,
      minPrice: Number(minPrice),
      maxPrice: Number(maxPrice),
      minQuantity: Number(minQuantity),
      maxQuantity: Number(maxQuantity),
      storeId: Number(storeId),
      storeName,
    });
  }
}

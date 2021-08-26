import { PaginationOptions } from "src/support/pagination/pagination-options";
import queryStringToBoolean from "src/support/query-string-to-boolean";

type StoreAdFilters = {
  id: number;
  priority: number;
  storeName: string;
  minDate: string;
  maxDate: string;
  minPrice: string;
  maxPrice: string;
  isActive: boolean|null;
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
      priority,
      storeName,
      minDate,
      maxDate,
      minPrice,
      maxPrice,
      isActive,
    } = query;
    return new StoreAdPaginationOptionsDto(+page, +perPage, {
      id: +id,
      priority: +priority,
      storeName,
      minDate,
      maxDate,
      minPrice,
      maxPrice,
      isActive: queryStringToBoolean(isActive),
    });
  }
}

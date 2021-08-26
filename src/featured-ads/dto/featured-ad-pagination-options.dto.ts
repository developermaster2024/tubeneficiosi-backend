import { PaginationOptions } from "src/support/pagination/pagination-options";
import queryStringToBoolean from "src/support/query-string-to-boolean";

type FeaturedAdFilters = {
  id: number;
  priority: number;
  productName: string;
  storeName: string;
  storeCategoryId: number;
  minDate: string;
  maxDate: string;
  minPrice: string;
  maxPrice: string;
  isActive: boolean|null;
};

export class FeaturedAdPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: FeaturedAdFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): FeaturedAdPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      priority,
      productName,
      storeName,
      storeCategoryId,
      minDate,
      maxDate,
      minPrice,
      maxPrice,
      isActive,
    } = query;
    return new FeaturedAdPaginationOptionsDto(+page, +perPage, {
      id: +id,
      priority: +priority,
      productName,
      storeName,
      storeCategoryId: +storeCategoryId,
      minDate,
      maxDate,
      minPrice,
      maxPrice,
      isActive: queryStringToBoolean(isActive),
    });
  }
}

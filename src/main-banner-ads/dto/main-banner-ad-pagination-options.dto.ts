import { PaginationOptions } from "src/support/pagination/pagination-options";
import queryStringToBoolean from "src/support/query-string-to-boolean";

type MainBannerAdFilters = {
  id: number;
  priority: number;
  storeName: string;
  minDate: string;
  maxDate: string;
  minPrice: string;
  maxPrice: string;
  url: string;
  isActive: boolean|null;
};

export class MainBannerAdPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: MainBannerAdFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): MainBannerAdPaginationOptionsDto {
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
      url,
      isActive,
    } = query;
    return new MainBannerAdPaginationOptionsDto(+page, +perPage, {
      id: +id,
      priority: +priority,
      storeName,
      minDate,
      maxDate,
      minPrice,
      maxPrice,
      url,
      isActive: queryStringToBoolean(isActive),
    });
  }
}

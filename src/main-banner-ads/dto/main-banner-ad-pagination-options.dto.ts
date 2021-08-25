import { PaginationOptions } from "src/support/pagination/pagination-options";
import queryStringToBoolean from "src/support/query-string-to-boolean";

type MainBannerAdFilters = {
  id: string;
  storeId: string;
  date: string;
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
      storeId,
      date,
      isActive,
    } = query;
    return new MainBannerAdPaginationOptionsDto(+page, +perPage, {
      id,
      storeId,
      date,
      isActive: queryStringToBoolean(isActive),
    });
  }
}

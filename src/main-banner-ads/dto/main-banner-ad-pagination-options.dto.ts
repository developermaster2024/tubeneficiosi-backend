import { PaginationOptions } from "src/support/pagination/pagination-options";

type MainBannerAdFilters = {
  id: string;
  storeId: string;
  date: string;
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
    } = query;
    return new MainBannerAdPaginationOptionsDto(+page, +perPage, {id, storeId, date});
  }
}

import { PaginationOptions } from "src/support/pagination/pagination-options";

type AdFilters = {
  id: string;
  date: string;
  storeId: string;
  adsPositionId: string;
};

export class AdPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: AdFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): AdPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      date,
      storeId,
      adsPositionId,
    } = query;
    return new AdPaginationOptionsDto(+page, +perPage, {id, date, storeId, adsPositionId});
  }
}

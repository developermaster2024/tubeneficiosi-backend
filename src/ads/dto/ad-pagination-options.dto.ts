import { PaginationOptions } from "src/support/pagination/pagination-options";

type AdFilters = {
  id: string;
  title: string;
  description: string;
  storeId: number;
  minDate: string;
  maxDate: string;
  minPrice: string;
  maxPrice: string;
  url: string;
  adsPositionId: number;
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
      title,
      description,
      storeId,
      minDate,
      maxDate,
      minPrice,
      maxPrice,
      url,
      adsPositionId,
    } = query;

    return new AdPaginationOptionsDto(+page, +perPage, {
      id,
      title,
      description,
      storeId: Number(storeId),
      minDate,
      maxDate,
      minPrice,
      maxPrice,
      url,
      adsPositionId: Number(adsPositionId),
    });
  }
}

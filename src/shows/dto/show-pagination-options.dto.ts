import { PaginationOptions } from "src/support/pagination/pagination-options";
import queryStringToBoolean from "src/support/query-string-to-boolean";

type ShowFilters = {
  id: number;
  date: string;
  productId: string,
  isActive: boolean|null;
};

export class ShowPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: ShowFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): ShowPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      date,
      productId,
      isActive,
    } = query;

    return new ShowPaginationOptionsDto(+page, +perPage, {
      id: +id,
      date,
      productId,
      isActive: queryStringToBoolean(isActive),
    });
  }
}

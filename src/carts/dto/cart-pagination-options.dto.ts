import { PaginationOptions } from "src/support/pagination/pagination-options";
import queryStringToBoolean from "src/support/query-string-to-boolean";

type CartFilters = {
  id: string;
  storeName: string;
  clientName: string;
  minTotal: number;
  maxTotal: number;
  minDate: string;
  maxDate: string;
  isProcessed: boolean|null;
  isExpired: boolean|null;
  isDirectPurchase: boolean|null;
};

export class CartPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: CartFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): CartPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      storeName,
      clientName,
      minTotal,
      maxTotal,
      minDate,
      maxDate,
      isProcessed,
      isExpired,
      isDirectPurchase,
    } = query;

    return new CartPaginationOptionsDto(+page, +perPage, {
      id,
      storeName,
      clientName,
      minTotal: Number(minTotal),
      maxTotal: Number(maxTotal),
      minDate: minDate,
      maxDate: maxDate,
      isProcessed: queryStringToBoolean(isProcessed),
      isExpired: queryStringToBoolean(isExpired),
      isDirectPurchase: queryStringToBoolean(isDirectPurchase),
    });
  }
}

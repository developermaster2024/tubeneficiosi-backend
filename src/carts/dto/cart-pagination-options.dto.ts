import { PaginationOptions } from "src/support/pagination/pagination-options";

type CartFilters = {
  id: string;
  storeName: string;
  minTotal: number;
  maxTotal: number;
  minDate: string;
  maxDate: string;
  isProcessed: boolean;
  isExpired: boolean;
  isDirectPurchase: boolean;
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
      minTotal: Number(minTotal),
      maxTotal: Number(maxTotal),
      minDate: minDate,
      maxDate: maxDate,
      isProcessed: isProcessed === 'true',
      isExpired: isExpired === 'true',
      isDirectPurchase: isDirectPurchase === 'true',
    });
  }
}

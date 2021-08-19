import { PaginationOptions } from "src/support/pagination/pagination-options";

type OrderFilters = {
  id: string;
  orderNumber: string;
  address: string;
  storeName: string;
  minTotal: number;
  maxTotal: number;
  minDate: string;
  maxDate: string;
  orderStatusCode: string;
  paymentMethodCode: string;
};

export class OrderPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: OrderFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): OrderPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      orderNumber,
      address,
      storeName,
      minTotal,
      maxTotal,
      minDate,
      maxDate,
      orderStatusCode,
      paymentMethodCode,
    } = query;

    return new OrderPaginationOptionsDto(+page, +perPage, {
      id,
      orderNumber,
      address,
      storeName,
      minTotal: Number(minTotal),
      maxTotal: Number(maxTotal),
      minDate: minDate,
      maxDate: maxDate,
      orderStatusCode,
      paymentMethodCode,
    });
  }
}

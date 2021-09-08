import { PaginationOptions } from "src/support/pagination/pagination-options";
import queryStringToBoolean from "src/support/query-string-to-boolean";

type PaymentMethodFilters = {
  codes: string[];
  name: string;
  usesBankAccounts: boolean;
};

export class PaymentMethodPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: PaymentMethodFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): PaymentMethodPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      codes = '',
      name,
      usesBankAccounts,
    } = query;

    return new PaymentMethodPaginationOptionsDto(+page, +perPage, {
      codes: codes.split(',').filter(code => code),
      name,
      usesBankAccounts: queryStringToBoolean(usesBankAccounts),
    });
  }
}

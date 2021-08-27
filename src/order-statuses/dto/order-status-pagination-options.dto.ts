import { PaginationOptions } from "src/support/pagination/pagination-options";
import { Role } from "src/users/enums/roles.enum";
import { OrderStatuses } from "../enums/order-statuses.enum";

type OrderStatusFilters = {
  code: OrderStatuses;
  allowedByCodeAndRole: [OrderStatuses, Role];
};

export class OrderStatusPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: OrderStatusFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): OrderStatusPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      code,
      allowedByCodeAndRole,
    } = query;

    return new OrderStatusPaginationOptionsDto(+page, +perPage, {
      code: code as OrderStatuses,
      allowedByCodeAndRole: allowedByCodeAndRole ? (allowedByCodeAndRole.split(',') as [OrderStatuses, Role]) : null,
    });
  }
}

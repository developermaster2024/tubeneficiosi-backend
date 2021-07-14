import { PaginationOptions } from "src/support/pagination/pagination-options";

type NotificationFilters = {
  id: string;
  role: string;
  from: string;
  until: string;
};

export class NotificationPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: NotificationFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): NotificationPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      role,
      from,
      until,
    } = query;
    return new NotificationPaginationOptionsDto(+page, +perPage, {id, role, from, until});
  }
}

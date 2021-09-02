import { parseSort } from "src/database/utils/sort";
import { PaginationOptions } from "src/support/pagination/pagination-options";

type NotificationFilters = {
  id: number;
  from: string;
  until: string;
  forUserId: number;
};

export class NotificationPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: NotificationFilters, public order: ReturnType<typeof parseSort>) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): NotificationPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      from,
      until,
      forUserId,
      sort = '',
    } = query;

    const order = parseSort(sort, ['createdAt']);

    return new NotificationPaginationOptionsDto(+page, +perPage, {
      id: +id,
      from,
      until,
      forUserId: +forUserId,
    }, order);
  }
}

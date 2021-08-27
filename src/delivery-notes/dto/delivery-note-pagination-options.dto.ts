import { PaginationOptions } from "src/support/pagination/pagination-options";

type DeliveryNoteFilters = {
  id: number;
};

export class DeliveryNotePaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: DeliveryNoteFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): DeliveryNotePaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
    } = query;

    return new DeliveryNotePaginationOptionsDto(+page, +perPage, {
      id: +id,
    });
  }
}

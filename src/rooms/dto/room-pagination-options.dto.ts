import { PaginationOptions } from "src/support/pagination/pagination-options";

type RoomFilters = {
  id: number;
  name: string;
  storeId: number;
  storeName: string;
};

export class RoomPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: RoomFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): RoomPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      name,
      storeId,
      storeName,
    } = query;

    return new RoomPaginationOptionsDto(+page, +perPage, {
      id: +id,
      name,
      storeId: +storeId,
      storeName,
    });
  }
}

import { PaginationOptions } from "src/support/pagination/pagination-options";

type PlaceFilters = {
  id: number;
  name: string;
  storeId: number;
  storeName: string;
};

export class PlacePaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: PlaceFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): PlacePaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      name,
      storeId,
      storeName,
    } = query;

    return new PlacePaginationOptionsDto(+page, +perPage, {
      id: +id,
      name,
      storeId: +storeId,
      storeName,
    });
  }
}

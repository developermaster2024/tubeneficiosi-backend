import { PaginationOptions } from "src/support/pagination/pagination-options";

type LocationFilters = {
  id: string;
  name: string;
  parentId: string;
};

export class LocationPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: LocationFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): LocationPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      name,
      parentId
    } = query;
    return new LocationPaginationOptionsDto(+page, +perPage, {id, name, parentId});
  }
}

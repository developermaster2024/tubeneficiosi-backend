import { PaginationOptions } from "src/support/pagination/pagination-options";

type LocationFilters = {
  id: number;
  name: string;
  parentId: string;
  excludeIds: number[];
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
      parentId,
      excludeIds = '',
    } = query;

    return new LocationPaginationOptionsDto(+page, +perPage, {
      id: +id,
      name,
      parentId,
      excludeIds: excludeIds.split(',').filter(id => id).map(id => Number(id)),
    });
  }
}

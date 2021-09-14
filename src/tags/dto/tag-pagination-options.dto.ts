import { PaginationOptions } from "src/support/pagination/pagination-options";

type TagFilters = {
  id: number;
  name: string;
  storeCategoryIds: number[];
  excludeIds: number[];
};

export class TagPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: TagFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): TagPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      name,
      storeCategoryIds = '',
      excludeIds = '',
    } = query;
    return new TagPaginationOptionsDto(+page, +perPage, {
      id: +id,
      name,
      storeCategoryIds: storeCategoryIds.split(',').filter(id => id).map(id => Number(id)),
      excludeIds: excludeIds.split(',').filter(id => id).map(id => Number(id)),
    });
  }
}

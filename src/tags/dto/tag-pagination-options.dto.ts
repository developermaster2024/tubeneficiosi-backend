import { PaginationOptions } from "src/support/pagination/pagination-options";

type TagFilters = {
  id: string;
  name: string;
  storeCategoryIds: number[];
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
    } = query;
    return new TagPaginationOptionsDto(+page, +perPage, {
      id,
      name,
      storeCategoryIds: storeCategoryIds.split(',').filter(id => id).map(id => Number(id)),
    });
  }
}

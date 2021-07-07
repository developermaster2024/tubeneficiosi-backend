import { PaginationOptions } from "src/support/pagination/pagination-options";

type TagFilters = {
  id: string;
  name: string;
  storeCategoryId: string;
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
      storeCategoryId,
    } = query;
    return new TagPaginationOptionsDto(+page, +perPage, {id, name, storeCategoryId});
  }
}

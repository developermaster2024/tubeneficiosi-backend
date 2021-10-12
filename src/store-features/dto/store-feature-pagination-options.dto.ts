import { PaginationOptions } from "src/support/pagination/pagination-options";

type StoreFeatureFilters = {
  id: number;
  name: string;
  storeCategoryIds: number[];
};

export class StoreFeaturePaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: StoreFeatureFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): StoreFeaturePaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      name,
      storeCategoryIds = '',
    } = query;

    return new StoreFeaturePaginationOptionsDto(+page, +perPage, {
      id: +id,
      name,
      storeCategoryIds: storeCategoryIds.split(',').filter(id => id).map(id => Number(id)),
    });
  }
}

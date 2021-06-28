import { PaginationOptions } from "src/support/pagination/pagination-options";

type FeaturedAdFilters = {
  id: string;
  date: string;
  productId: string;
  storeCategoryId: string;
};

export class FeaturedAdPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: FeaturedAdFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): FeaturedAdPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      date,
      productId,
      storeCategoryId,
    } = query;
    return new FeaturedAdPaginationOptionsDto(+page, +perPage, {id, date, productId, storeCategoryId});
  }
}

import { PaginationOptions } from "src/support/pagination/pagination-options";

type ProductFeatureFilters = {
  id: string;
  name: string;
};

export class ProductFeaturePaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: ProductFeatureFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): ProductFeaturePaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      name,
    } = query;
    return new ProductFeaturePaginationOptionsDto(+page, +perPage, {id, name});
  }
}

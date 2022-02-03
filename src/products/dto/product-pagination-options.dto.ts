import { PaginationOptions } from "src/support/pagination/pagination-options";

type ProductFilters = {
  id: string;
  name: string;
  reference: string;
  minPrice: number;
  maxPrice: number;
  minQuantity: number;
  maxQuantity: number;
  categoryIds: number[];
  categoryName: string;
  tagIds: number[];
  storeId: number;
  storeName: string;
  storeCategoryIds: number[];
  cardIssuerIds: number[];
  cardIds: number[];
  isFavoriteFor: number;
  minRating: number;
  storeFeatureIds: number[];
  showDate: string;
  minDiscount: number;
};

export class ProductPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: ProductFilters, public tagsToSortBy: number[]) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): ProductPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      name,
      reference,
      minPrice,
      maxPrice,
      minQuantity,
      maxQuantity,
      categoryIds = '',
      categoryName,
      tagIds = '',
      storeId,
      storeName,
      storeCategoryIds = '',
      sortByTags = '',
      cardIssuerIds = '',
      cardIds = '',
      isFavoriteFor,
      minRating,
      storeFeatureIds = '',
      showDate,
      minDiscount,
    } = query;

    return new ProductPaginationOptionsDto(+page, +perPage, {
      id,
      name,
      reference,
      minPrice: Number(minPrice),
      maxPrice: Number(maxPrice),
      minQuantity: Number(minQuantity),
      maxQuantity: Number(maxQuantity),
      categoryIds: categoryIds.split(',').filter(id => id).map(id => Number(id)),
      categoryName,
      tagIds: tagIds.split(',').filter(id => id).map(id => Number(id)),
      storeId: Number(storeId),
      storeName,
      storeCategoryIds: storeCategoryIds.split(',').filter(id => id).map(id => Number(id)),
      cardIssuerIds: cardIssuerIds.split(',').filter(id => id).map(id => Number(id)),
      cardIds: cardIds.split(',').filter(id => id).map(id => Number(id)),
      isFavoriteFor: +isFavoriteFor,
      minRating: +minRating,
      storeFeatureIds: storeFeatureIds.split(',').filter(id => id).map(id => Number(id)),
      showDate,
      minDiscount: +minDiscount,
    }, sortByTags.split(',').filter(id => id).map(id => Number()));
  }
}

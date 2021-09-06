import { PaginationOptions } from "src/support/pagination/pagination-options";
import queryStringToBoolean from "src/support/query-string-to-boolean";

type DiscountFilters = {
  id: number;
  storeIds: number[];
  cardIssuerIds: number[];
  cardIds: number[];
  minValue: number;
  maxValue: number;
  isActive: boolean|null;
  minDate: string;
  maxDate: string;
  name: string;
  storeCategoryIds: number[];
  discountTypeCode: string;
};

export class DiscountPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: DiscountFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): DiscountPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      storeIds = '',
      cardIssuerIds = '',
      cardIds = '',
      minValue,
      maxValue,
      isActive,
      minDate,
      maxDate,
      name,
      storeCategoryIds = '',
      discountTypeCode,
    } = query;

    return new DiscountPaginationOptionsDto(+page, +perPage, {
      id: +id,
      storeIds: storeIds.split(',').filter(id => id).map(id => Number(id)),
      cardIssuerIds: cardIssuerIds.split(',').filter(id => id).map(id => Number(id)),
      cardIds: cardIds.split(',').filter(id => id).map(id => Number(id)),
      minValue: +minValue,
      maxValue: +maxValue,
      isActive: queryStringToBoolean(isActive),
      minDate,
      maxDate,
      name,
      storeCategoryIds: storeCategoryIds.split(',').filter(id => id).map(id => Number(id)),
      discountTypeCode,
    });
  }
}

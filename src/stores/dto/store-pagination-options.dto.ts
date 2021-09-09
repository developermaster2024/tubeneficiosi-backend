import { PaginationOptions } from "src/support/pagination/pagination-options";

type StoreFilters = {
  id: string;
  name: string;
  email: string;
  status: string;
  phoneNumber: string;
  storeCategoryIds: number[];
  userStatusCode: string;
  withCheapestProduct: boolean;
  cardIssuerIds: number[];
  cardIds: number[];
};

export class StorePaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: StoreFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): StorePaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      name,
      email,
      status,
      phoneNumber,
      storeCategoryIds = '',
      userStatusCode,
      withCheapestProduct,
      cardIssuerIds = '',
      cardIds = '',
    } = query;

    return new StorePaginationOptionsDto(+page, +perPage, {
      id,
      name,
      email,
      status,
      phoneNumber,
      storeCategoryIds: storeCategoryIds.split(',').filter(id => id).map(id => Number(id)),
      userStatusCode,
      withCheapestProduct: withCheapestProduct === 'true',
      cardIssuerIds: cardIssuerIds.split(',').filter(id => id).map(id => Number(id)),
      cardIds: cardIds.split(',').filter(id => id).map(id => Number(id)),
    });
  }
}

import { PaginationOptions } from "src/support/pagination/pagination-options";

type StoreFilters = {
  id: string;
  name: string;
  email: string;
  status: string;
  phoneNumber: string;
  storeCategoryId: string;
  userStatusCode: string;
  withCheapestProduct: boolean;
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
      storeCategoryId,
      userStatusCode,
      withCheapestProduct,
    } = query;

    return new StorePaginationOptionsDto(+page, +perPage, {
      id,
      name,
      email,
      status,
      phoneNumber,
      storeCategoryId,
      userStatusCode,
      withCheapestProduct: withCheapestProduct === 'true',
    });
  }
}

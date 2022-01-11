import { PaginationOptions } from "src/support/pagination/pagination-options";

type DeliveryMethodFilters = {
  id: string;
  name: string;
  storeId: number;
  deliveryMethodTypeCode: string;
  addressId: number;
  forCartId: number;
};

export class DeliveryMethodPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: DeliveryMethodFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): DeliveryMethodPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      name,
      storeId,
      deliveryMethodTypeCode,
      addressId,
      forCartId,
    } = query;

    return new DeliveryMethodPaginationOptionsDto(+page, +perPage, {
      id,
      name,
      storeId: Number(storeId),
      deliveryMethodTypeCode,
      addressId: Number(addressId),
      forCartId: +forCartId,
    });
  }
}

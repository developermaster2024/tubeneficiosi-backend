import { PaginationOptions } from "src/support/pagination/pagination-options";
import queryStringToBoolean from "src/support/query-string-to-boolean";

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
  isFavoriteFor: number;
  storeFeatureIds: number[];
  userLatLng: [number, number],
  locationIds: number[],
  withinLocationId: number;
  withinWktPolygon: string;
  minRating: number;
  isOpen: boolean|null;
  minDiscount: number;
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
      isFavoriteFor,
      storeFeatureIds = '',
      userLatLng = '',
      locationIds = '',
      withinLocationId,
      withinWktPolygon,
      minRating,
      isOpen,
      minDiscount,
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
      isFavoriteFor: +isFavoriteFor,
      storeFeatureIds: storeFeatureIds.split(',').filter(id => id).map(id => Number(id)),
      userLatLng: userLatLng.split(',').filter(value => value).map(value => Number(value)) as [number, number],
      locationIds: locationIds.split(',').filter(id => id).map(id => Number(id)),
      withinLocationId: +withinLocationId,
      withinWktPolygon,
      minRating: +minRating,
      isOpen: queryStringToBoolean(isOpen),
      minDiscount: +minDiscount,
    });
  }
}

import { PaginationOptions } from "src/support/pagination/pagination-options";

type CardIssuerFilters = {
  id: string;
  name: string;
  cardIssuerTypeId: number;
};

export class CardIssuerPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: CardIssuerFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): CardIssuerPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      name,
      cardIssuerTypeId,
    } = query;

    return new CardIssuerPaginationOptionsDto(+page, +perPage, {
      id,
      name,
      cardIssuerTypeId: Number(cardIssuerTypeId),
    });
  }
}

import { PaginationOptions } from "src/support/pagination/pagination-options";

type CardFilters = {
  id: string;
  name: string;
  cardIssuerId: number;
  cardTypeId: number;
};

export class CardPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: CardFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): CardPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      name,
      cardIssuerId,
      cardTypeId,
    } = query;

    return new CardPaginationOptionsDto(+page, +perPage, {
      id,
      name,
      cardIssuerId: Number(cardIssuerId),
      cardTypeId: Number(cardTypeId),
    });
  }
}

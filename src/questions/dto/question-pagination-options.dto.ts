import { PaginationOptions } from "src/support/pagination/pagination-options";

type QuestionFilters = {
  id: string;
  productId: string;
};

export class QuestionPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: QuestionFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): QuestionPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      productId
    } = query;
    return new QuestionPaginationOptionsDto(+page, +perPage, {id, productId});
  }
}

import { PaginationOptions } from "src/support/pagination/pagination-options";
import { parseSort } from "src/database/utils/sort";

type QuestionFilters = {
  id: string;
  productId: string;
};

export class QuestionPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: QuestionFilters, public order: ReturnType<typeof parseSort>) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): QuestionPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      productId,
      sort = '',
    } = query;

    const order = parseSort(sort, ['createdAt']);

    return new QuestionPaginationOptionsDto(+page, +perPage, {id, productId}, order);
  }
}

import { PaginationOptions } from "src/support/pagination/pagination-options";

type UserFilters = {
  id: string;
  email: string;
  status: string;
  name: string;
  userStatusCode: string;
};

export class UserPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: UserFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): UserPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      email,
      name,
      status,
      userStatusCode,
    } = query;
    return new UserPaginationOptionsDto(+page, +perPage, {id, email, name, status, userStatusCode});
  }
}

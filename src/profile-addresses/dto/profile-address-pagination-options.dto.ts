import { PaginationOptions } from "src/support/pagination/pagination-options";

type ProfileAddressFilters = {
  id: number;
  name: string;
};

export class ProfileAddressPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: ProfileAddressFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): ProfileAddressPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      name,
    } = query;

    return new ProfileAddressPaginationOptionsDto(+page, +perPage, {
      id: +id,
      name,
    });
  }
}

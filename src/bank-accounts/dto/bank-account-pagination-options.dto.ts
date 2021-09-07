import { PaginationOptions } from "src/support/pagination/pagination-options";

type BankAccountFilters = {
  id: string;
  alias: string;
  accountNumber: string;
  bankAccountTypeId: number;
  bankAccountTypeName: string;
  cbu: string;
  cardIssuerName: string;
  cardIssuerIds: number[];
  branchOffice: string;
  paymentMethodCode: string;
};

export class BankAccountPaginationOptionsDto extends PaginationOptions {
  constructor(public page: number, protected _perPage: number, public filters: BankAccountFilters) {
    super(page, _perPage);
  }

  static fromQueryObject(query: Record<string, string>): BankAccountPaginationOptionsDto {
    const {
      page = 1,
      perPage = 10,
      id,
      alias,
      accountNumber,
      bankAccountTypeId,
      bankAccountTypeName,
      cbu,
      cardIssuerName,
      cardIssuerIds = '',
      branchOffice,
      paymentMethodCode,
    } = query;

    return new BankAccountPaginationOptionsDto(+page, +perPage, {
      id,
      alias,
      accountNumber,
      bankAccountTypeId: Number(bankAccountTypeId),
      bankAccountTypeName,
      cbu,
      cardIssuerName,
      cardIssuerIds: cardIssuerIds.split(',').filter(id => id).map(id => Number(id)),
      branchOffice,
      paymentMethodCode,
    });
  }
}

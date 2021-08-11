import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { BankAccountPaginationOptionsDto } from "../dto/bank-account-pagination-options.dto";

@Injectable()
export class BankAccountPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return BankAccountPaginationOptionsDto.fromQueryObject(value);
  }
}

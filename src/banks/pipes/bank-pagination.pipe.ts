import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { BankPaginationOptionsDto } from "../dto/bank-pagination-options.dto";

@Injectable()
export class BankPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return BankPaginationOptionsDto.fromQueryObject(value);
  }
}

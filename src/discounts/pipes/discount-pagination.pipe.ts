import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { DiscountPaginationOptionsDto } from "../dto/discount-pagination-options.dto";

@Injectable()
export class DiscountPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return DiscountPaginationOptionsDto.fromQueryObject(value);
  }
}

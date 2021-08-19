import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { OrderPaginationOptionsDto } from "../dto/order-pagination-options.dto";

@Injectable()
export class OrderPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return OrderPaginationOptionsDto.fromQueryObject(value);
  }
}

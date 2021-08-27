import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { OrderStatusPaginationOptionsDto } from "../dto/order-status-pagination-options.dto";

@Injectable()
export class OrderStatusPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return OrderStatusPaginationOptionsDto.fromQueryObject(value);
  }
}

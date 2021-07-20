import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { DeliveryMethodPaginationOptionsDto } from "../dto/delivery-method-pagination-options.dto";

@Injectable()
export class DeliveryMethodPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return DeliveryMethodPaginationOptionsDto.fromQueryObject(value);
  }
}

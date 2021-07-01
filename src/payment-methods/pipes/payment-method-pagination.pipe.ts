import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { PaymentMethodPaginationOptionsDto } from "../dto/payment-method-pagination-options.dto";

@Injectable()
export class PaymentMethodPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return PaymentMethodPaginationOptionsDto.fromQueryObject(value);
  }
}

import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { DeliveryNotePaginationOptionsDto } from "../dto/delivery-note-pagination-options.dto";

@Injectable()
export class DeliveryNotePaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return DeliveryNotePaginationOptionsDto.fromQueryObject(value);
  }
}

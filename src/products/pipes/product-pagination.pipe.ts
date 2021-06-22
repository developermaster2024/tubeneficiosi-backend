import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { ProductPaginationOptionsDto } from "../dto/product-pagination-options.dto";

@Injectable()
export class ProductPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return ProductPaginationOptionsDto.fromQueryObject(value);
  }
}

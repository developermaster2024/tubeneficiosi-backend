import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { ProductFeaturePaginationOptionsDto } from "../dto/product-feature-pagination-options.dto";

@Injectable()
export class ProductFeaturePaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return ProductFeaturePaginationOptionsDto.fromQueryObject(value);
  }
}

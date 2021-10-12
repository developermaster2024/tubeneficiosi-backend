import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { StoreFeaturePaginationOptionsDto } from "../dto/store-feature-pagination-options.dto";

@Injectable()
export class StoreFeaturePaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return StoreFeaturePaginationOptionsDto.fromQueryObject(value);
  }
}

import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { StoreAdPaginationOptionsDto } from "../dto/store-ad-pagination-options.dto";

@Injectable()
export class StoreAdPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return StoreAdPaginationOptionsDto.fromQueryObject(value);
  }
}

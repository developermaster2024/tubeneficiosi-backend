import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { StorePaginationOptionsDto } from "../dto/store-pagination-options.dto";

@Injectable()
export class StorePaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return StorePaginationOptionsDto.fromQueryObject(value);
  }
}

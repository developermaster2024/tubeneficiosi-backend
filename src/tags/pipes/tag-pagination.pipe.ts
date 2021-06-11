import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { TagPaginationOptionsDto } from "../dto/tag-pagination-options.dto";

@Injectable()
export class TagPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return TagPaginationOptionsDto.fromQueryObject(value);
  }
}

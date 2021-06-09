import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { CategoryPaginationOptionsDto } from "../dto/category-pagination-options.dto";

@Injectable()
export class CategoryPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return CategoryPaginationOptionsDto.fromQueryObject(value);
  }
}

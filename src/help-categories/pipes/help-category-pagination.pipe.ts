import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { HelpCategoryPaginationOptionsDto } from "../dto/help-category-pagination-options.dto";

@Injectable()
export class HelpCategoryPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return HelpCategoryPaginationOptionsDto.fromQueryObject(value);
  }
}

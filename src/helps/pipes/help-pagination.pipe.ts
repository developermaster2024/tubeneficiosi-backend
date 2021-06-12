import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { HelpPaginationOptionsDto } from "../dto/help-pagination-options.dto";

@Injectable()
export class HelpPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return HelpPaginationOptionsDto.fromQueryObject(value);
  }
}

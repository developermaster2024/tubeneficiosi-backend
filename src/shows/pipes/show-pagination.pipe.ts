import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { ShowPaginationOptionsDto } from "../dto/show-pagination-options.dto";

@Injectable()
export class ShowPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return ShowPaginationOptionsDto.fromQueryObject(value);
  }
}

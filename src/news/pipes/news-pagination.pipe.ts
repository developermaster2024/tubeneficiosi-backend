import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { NewsPaginationOptionsDto } from "../dto/news-pagination-options.dto";

@Injectable()
export class NewsPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return NewsPaginationOptionsDto.fromQueryObject(value);
  }
}

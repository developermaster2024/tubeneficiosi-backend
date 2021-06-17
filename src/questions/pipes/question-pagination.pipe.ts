import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { QuestionPaginationOptionsDto } from "../dto/question-pagination-options.dto";

@Injectable()
export class QuestionPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return QuestionPaginationOptionsDto.fromQueryObject(value);
  }
}

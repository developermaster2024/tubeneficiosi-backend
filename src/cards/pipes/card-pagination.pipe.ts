import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { CardPaginationOptionsDto } from "../dto/card-pagination-options.dto";

@Injectable()
export class CardPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return CardPaginationOptionsDto.fromQueryObject(value);
  }
}

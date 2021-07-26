import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { CardIssuerPaginationOptionsDto } from "../dto/card-issuer-pagination-options.dto";

@Injectable()
export class CardIssuerPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return CardIssuerPaginationOptionsDto.fromQueryObject(value);
  }
}

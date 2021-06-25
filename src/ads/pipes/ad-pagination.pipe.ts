import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { AdPaginationOptionsDto } from "../dto/ad-pagination-options.dto";

@Injectable()
export class AdPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return AdPaginationOptionsDto.fromQueryObject(value);
  }
}

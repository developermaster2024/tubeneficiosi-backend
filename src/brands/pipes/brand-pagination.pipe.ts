import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { BrandPaginationOptionsDto } from "../dto/brand-pagination-options.dto";

@Injectable()
export class BrandPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return BrandPaginationOptionsDto.fromQueryObject(value);
  }
}

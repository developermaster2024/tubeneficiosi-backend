import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { FeaturedAdPaginationOptionsDto } from "../dto/featured-ad-pagination-options.dto";

@Injectable()
export class FeaturedAdPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return FeaturedAdPaginationOptionsDto.fromQueryObject(value);
  }
}

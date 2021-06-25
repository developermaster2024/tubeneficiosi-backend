import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { MainBannerAdPaginationOptionsDto } from "../dto/main-banner-ad-pagination-options.dto";

@Injectable()
export class MainBannerAdPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return MainBannerAdPaginationOptionsDto.fromQueryObject(value);
  }
}

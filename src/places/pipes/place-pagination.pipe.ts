import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { PlacePaginationOptionsDto } from "../dto/place-pagination-options.dto";

@Injectable()
export class PlacePaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return PlacePaginationOptionsDto.fromQueryObject(value);
  }
}

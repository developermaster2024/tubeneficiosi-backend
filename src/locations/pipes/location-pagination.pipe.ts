import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { LocationPaginationOptionsDto } from "../dto/location-pagination-options.dto";

@Injectable()
export class LocationPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return LocationPaginationOptionsDto.fromQueryObject(value);
  }
}

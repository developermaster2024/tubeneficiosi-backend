import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { PaginationOptions } from "./pagination-options";

@Injectable()
export class PaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return PaginationOptions.fromQueryObject(value);
  }
}

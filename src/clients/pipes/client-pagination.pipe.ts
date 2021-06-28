import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { ClientPaginationOptionsDto } from "../dto/client-pagination-options.dto";

@Injectable()
export class ClientPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return ClientPaginationOptionsDto.fromQueryObject(value);
  }
}

import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { UserPaginationOptionsDto } from "../dto/user-pagination-options.dto";

@Injectable()
export class UserPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return UserPaginationOptionsDto.fromQueryObject(value);
  }
}

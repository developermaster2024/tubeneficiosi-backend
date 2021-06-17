import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { NotificationPaginationOptionsDto } from "../dto/notification-pagination-options.dto";

@Injectable()
export class NotificationPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return NotificationPaginationOptionsDto.fromQueryObject(value);
  }
}

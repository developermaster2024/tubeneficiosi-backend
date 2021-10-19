import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { RoomPaginationOptionsDto } from "../dto/room-pagination-options.dto";

@Injectable()
export class RoomPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return RoomPaginationOptionsDto.fromQueryObject(value);
  }
}

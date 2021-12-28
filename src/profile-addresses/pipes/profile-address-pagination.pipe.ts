import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { ProfileAddressPaginationOptionsDto } from "../dto/profile-address-pagination-options.dto";

@Injectable()
export class ProfileAddressPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return ProfileAddressPaginationOptionsDto.fromQueryObject(value);
  }
}

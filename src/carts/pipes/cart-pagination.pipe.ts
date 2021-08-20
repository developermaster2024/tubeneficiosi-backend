import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { CartPaginationOptionsDto } from "../dto/cart-pagination-options.dto";

@Injectable()
export class CartPaginationPipe implements PipeTransform {
  transform(value: Record<string, string>, metadata: ArgumentMetadata) {
    return CartPaginationOptionsDto.fromQueryObject(value);
  }
}

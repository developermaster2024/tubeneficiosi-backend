import { HttpException, HttpStatus } from "@nestjs/common";
import { CartItem } from "../entities/cart-item.entity";

export class ProductQuantityIsLessThanRequiredQuantityException extends HttpException {
  constructor(cartItem: CartItem = null) {
    super({
      message: 'La cantidad del producto es menor a la cantidad solicitada',
      cartItem,
    }, HttpStatus.CONFLICT);
  }
}

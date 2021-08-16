import { HttpException, HttpStatus } from "@nestjs/common";

export class CartItemNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Item de carrito no encontrado',
    }, HttpStatus.NOT_FOUND);
  }
}

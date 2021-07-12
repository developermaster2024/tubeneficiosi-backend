import { HttpException, HttpStatus } from "@nestjs/common";

export class CartNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Carrito no encontrado',
    }, HttpStatus.NOT_FOUND);
  }
}

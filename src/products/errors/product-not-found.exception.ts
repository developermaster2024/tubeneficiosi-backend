import { HttpException, HttpStatus } from "@nestjs/common";

export class ProductNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Producto no encontrado',
    }, HttpStatus.NOT_FOUND);
  }
}

import { HttpException, HttpStatus } from "@nestjs/common";

export class ProductImageNotFound extends HttpException {
  constructor() {
    super({
      message: 'Imagen de producto no encontrada',
    }, HttpStatus.NOT_FOUND);
  }
}

import { HttpException, HttpStatus } from "@nestjs/common";

export class ProductVideoNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Video de producto no encontrado',
    }, HttpStatus.NOT_FOUND);
  }
}

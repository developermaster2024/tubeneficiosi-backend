import { HttpException, HttpStatus } from "@nestjs/common";

export class ProductFeatureNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Característica de producto no encontrada',
    }, HttpStatus.NOT_FOUND);
  }
}

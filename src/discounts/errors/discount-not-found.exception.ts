import { HttpException, HttpStatus } from "@nestjs/common";

export class DiscountNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Descuento no encontrado',
    }, HttpStatus.NOT_FOUND);
  }
}

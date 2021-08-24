import { HttpException, HttpStatus } from "@nestjs/common";

export class ShippingRangeNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Rango de envío no encontrado',
    }, HttpStatus.NOT_FOUND);
  }
}

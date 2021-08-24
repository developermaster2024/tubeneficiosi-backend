import { HttpException, HttpStatus } from "@nestjs/common";

export class DeliveryRangeNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Rango de entrega no encontrado',
    }, HttpStatus.NOT_FOUND);
  }
}

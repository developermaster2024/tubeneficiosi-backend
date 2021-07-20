import { HttpException, HttpStatus } from "@nestjs/common";

export class DeliveryMethodNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Método de envío no encontrado',
    }, HttpStatus.NOT_FOUND);
  }
}

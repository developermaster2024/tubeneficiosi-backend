import { HttpException, HttpStatus } from "@nestjs/common";

export class PaymentMethodNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Método de pago no encontrado',
    }, HttpStatus.NOT_FOUND);
  }
}

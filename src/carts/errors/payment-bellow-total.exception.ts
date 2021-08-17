import { HttpException, HttpStatus } from "@nestjs/common";

export class PaymentBelowTotalException extends HttpException {
  constructor() {
    super({
      message: 'El pago está por debajo del total de la orden',
    }, HttpStatus.CONFLICT);
  }
}

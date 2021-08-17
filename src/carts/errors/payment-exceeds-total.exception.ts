import { HttpException, HttpStatus } from "@nestjs/common";

export class PaymentExceedsTotalException extends HttpException {
  constructor() {
    super({
      message: 'El pago excede el total de la orden',
    }, HttpStatus.CONFLICT);
  }
}

import { HttpException, HttpStatus } from "@nestjs/common";

export class BankAccountNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Cuenta de banco no encontrada',
    }, HttpStatus.NOT_FOUND);
  }
}

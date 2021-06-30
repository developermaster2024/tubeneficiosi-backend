import { HttpException, HttpStatus } from "@nestjs/common";

export class BankNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Banco no encontrado',
    }, HttpStatus.NOT_FOUND);
  }
}

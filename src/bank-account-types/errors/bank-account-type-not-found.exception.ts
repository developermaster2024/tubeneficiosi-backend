import { HttpException, HttpStatus } from "@nestjs/common";

export class BankAccountTypeNotFound extends HttpException {
  constructor() {
    super({
      message: 'Tipo de cuenta bancaría no encontrado',
    }, HttpStatus.NOT_FOUND);
  }
}

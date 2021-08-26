import { HttpException, HttpStatus } from "@nestjs/common";

export class IncorrectOrderStatusException extends HttpException {
  constructor() {
    super({
      message: 'Estatus de orden incorrecto',
    }, HttpStatus.CONFLICT);
  }
}

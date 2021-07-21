import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super({
      message: 'Crednciales invalidas',
    }, HttpStatus.BAD_REQUEST);
  }
}

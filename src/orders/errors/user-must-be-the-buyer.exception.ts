import { HttpException, HttpStatus } from "@nestjs/common";

export class UserMustBeTheBuyer extends HttpException {
  constructor() {
    super({
      message: 'El usuario debe ser el comprador del producto',
    }, HttpStatus.CONFLICT);
  }
}

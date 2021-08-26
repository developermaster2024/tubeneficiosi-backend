import { HttpException, HttpStatus } from "@nestjs/common";

export class UserMustBeTheStoreThatOwnsTheProduct extends HttpException {
  constructor() {
    super({
      message: 'El usuario debe ser la tienda dueña del producto',
    }, HttpStatus.CONFLICT);
  }
}

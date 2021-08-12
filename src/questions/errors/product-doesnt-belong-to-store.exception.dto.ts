import { HttpException, HttpStatus } from "@nestjs/common";

export class ProductDoesntBelongToStore extends HttpException {
  constructor() {
    super({
      message: 'El producto no le pertenece a esta tienda',
    }, HttpStatus.CONFLICT);
  }
}

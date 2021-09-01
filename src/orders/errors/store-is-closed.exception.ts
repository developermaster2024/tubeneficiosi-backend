import { HttpException, HttpStatus } from "@nestjs/common";

export class StoreIsClosedException extends HttpException {
  constructor() {
    super({
      message: 'La tienda está cerrada en estos momentos',
    }, HttpStatus.CONFLICT);
  }
}

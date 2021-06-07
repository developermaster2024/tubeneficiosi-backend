import { HttpException, HttpStatus } from "@nestjs/common";

export class ProfileAddressNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Dirección no encontrada',
    }, HttpStatus.NOT_FOUND);
  }
}

import { HttpException, HttpStatus } from "@nestjs/common";

export class ZoneNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Zona no encontrada',
    }, HttpStatus.NOT_FOUND);
  }
}

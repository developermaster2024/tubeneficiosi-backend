import { HttpException, HttpStatus } from "@nestjs/common";

export class PlaceNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Lugar no encontrada',
    }, HttpStatus.NOT_FOUND);
  }
}

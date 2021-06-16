import { HttpException, HttpStatus } from "@nestjs/common";

export class LocationNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Ubicación no encontrada',
    }, HttpStatus.NOT_FOUND);
  }
}

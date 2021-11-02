import { HttpException, HttpStatus } from "@nestjs/common";

export class ShowNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Función no encontrada',
    }, HttpStatus.NOT_FOUND);
  }
}

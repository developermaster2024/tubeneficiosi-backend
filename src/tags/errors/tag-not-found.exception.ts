import { HttpException, HttpStatus } from "@nestjs/common";

export class TagNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Etiqueta no encontrada',
    }, HttpStatus.NOT_FOUND);
  }
}

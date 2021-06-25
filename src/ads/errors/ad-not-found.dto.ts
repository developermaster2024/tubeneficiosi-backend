import { HttpException, HttpStatus } from "@nestjs/common";

export class AdNotFound extends HttpException {
  constructor() {
    super({
      message: 'Anuncio no encontrado',
    }, HttpStatus.NOT_FOUND);
  }
}

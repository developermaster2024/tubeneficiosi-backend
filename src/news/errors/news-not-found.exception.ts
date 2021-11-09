import { HttpException, HttpStatus } from "@nestjs/common";

export class NewsNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Noticia no encontrada',
    }, HttpStatus.NOT_FOUND);
  }
}

import { HttpException, HttpStatus } from "@nestjs/common";

export class HelpNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Ayuda no encontrada',
    }, HttpStatus.NOT_FOUND);
  }
}
